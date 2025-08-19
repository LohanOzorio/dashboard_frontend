import { Component, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { TabIndicadorComponent } from '../tab-indicador/tab-indicador.component';
import { ChartMixedCardComponent } from '../chart-mixed-card/chart-mixed-card.component';
import { TesteQuadradoComponent } from '../teste-quadrado/teste-quadrado.component';

import { ApiService } from '../../services/api.service';
import { Meta } from '../../models/meta.model';
import { Faturamento } from '../../models/faturamento.model';
import { NaturezaCusto } from '../../models/naturezacusto.model';

type ChartData = { labels: string[]; datasets: Array<any> };
type ChartCfg = { title: string; barChartData?: ChartData; barChartOptions?: any; highlightChartData?: ChartData; highlightChartOptions?: any; mixedChartData?: ChartData; mixedChartOptions?: any; };

@Component({
  selector: 'page-faturamento-meta',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    InfoCardComponent,
    HighlightChartCardComponent,
    ChartCardComponent,
    TabIndicadorComponent,
    ChartMixedCardComponent,
    TesteQuadradoComponent
  ],
  templateUrl: './page-faturamento-meta.component.html',
  styleUrls: ['./page-faturamento-meta.component.scss'],
})
export class PageFaturamentoMetaComponent implements OnInit {

  mostrar = false;

  metaTS = signal<string>('R$ 0,00');
  metaTN = signal<string>('R$ 0,00');
  metaTotal = signal<string>('R$ 0,00');
  fatRealMes = signal<string>('R$ 0,00');

  barCharts: ChartCfg[] = [
    {
      title: 'Faturamento Mensal',
      barChartData: { labels: [], datasets: [{ label: 'Faturamento', data: [] }] },
      barChartOptions: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Faturamento por Mês' } } }
    },
    {
      title: 'Despesas por Centro de Custo',
      barChartData: { labels: [], datasets: [{ label: 'Despesas', data: [] }] },
      barChartOptions: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Despesas por Centro de Custo' } } }
    }
  ];

  highlightCharts: ChartCfg[] = [
    {
      title: 'Meta Atingida',
      highlightChartData: { labels: ['Atingido', 'Restante'], datasets: [{ label: 'Meta', data: [0, 0] }] },
      highlightChartOptions: { responsive: true }
    }
  ];

  mixedCharts: ChartCfg[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.carregarDados();
  }

  private carregarDados() {
    
    this.api.getMetas().subscribe({
  next: (metas: Meta[]) => {
    const ordenadas = [...metas].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );

   
    const last = ordenadas.length > 0 ? ordenadas[ordenadas.length - 1] : undefined;

    const ts = last?.ts ?? 0;
    const tn = last?.tn ?? 0;
    const total = last?.total ?? (ts + tn);

    this.metaTS.set(this.brl(ts));
    this.metaTN.set(this.brl(tn));
    this.metaTotal.set(this.brl(total));

    
    const labels = ordenadas.map(m => this.toShortDate(m.data));
    const tsData = ordenadas.map(m => m.ts ?? 0);
    const totalData = ordenadas.map(m => (m.total ?? ((m.ts ?? 0) + (m.tn ?? 0))));

    this.mixedCharts = [
      {
        title: 'Meta Total (barra) x Meta TS (linha)',
        mixedChartData: {
          labels,
          datasets: [
            { type: 'bar', label: 'Total', data: totalData },
            { type: 'line', label: 'TS', data: tsData },
          ],
        },
        mixedChartOptions: { responsive: true }
      }
    ];
  },
  error: err => console.error('Erro metas:', err)
});


    
    this.api.getFaturamento().subscribe({
      next: (fats: Faturamento[]) => {
        const ordenados = [...fats].sort((a, b) => new Date(a.data_emissao).getTime() - new Date(b.data_emissao).getTime());

        
        const now = new Date();
        const currMonth = now.getMonth();
        const currYear = now.getFullYear();
        const somaMes = ordenados.reduce((acc, f) => {
          const d = new Date(f.data_emissao);
          if (d.getMonth() === currMonth && d.getFullYear() === currYear) acc += (f.valor_nota ?? 0);
          return acc;
        }, 0);
        this.fatRealMes.set(this.brl(somaMes));

        
        const mapaMes: Record<string, number> = {};
        for (const f of ordenados) {
          const d = new Date(f.data_emissao);
          const chave = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; 
          mapaMes[chave] = (mapaMes[chave] ?? 0) + (f.valor_nota ?? 0);
        }
        const labels = Object.keys(mapaMes);
        const valores = labels.map(l => mapaMes[l]);

       
        this.barCharts = [
          {
            ...this.barCharts[0],
            barChartData: {
              labels: labels,
              datasets: [
                {
                  label: 'Faturamento',
                  data: valores
                }
              ]
            }
          },
          this.barCharts[1] 
        ];

        
        const metaAlvo = this.parseBRL(this.metaTotal()); 
        const restante = Math.max(metaAlvo - somaMes, 0);
        this.highlightCharts = [
          {
            ...this.highlightCharts[0],
            highlightChartData: {
              labels: ['Atingido', 'Restante'],
              datasets: [{ label: 'Meta', data: [somaMes, restante] }]
            }
          }
        ];
      },
      error: err => console.error('Erro faturamento:', err)
    });

    
    this.api.getNaturezaCusto().subscribe({
      next: (rows: NaturezaCusto[]) => {
        
        const somaPorCusto: Record<string, number> = {};
        for (const r of rows) {
          const chave = r.desc_custo?.trim() || 'Sem classificação';
          const valor = this.toNumber(r.valor_item); 
          somaPorCusto[chave] = (somaPorCusto[chave] ?? 0) + valor;
        }

        
        const entries = Object.entries(somaPorCusto).sort((a, b) => b[1] - a[1]);
        const top = entries.slice(0, 8);
        const outros = entries.slice(8).reduce((acc, [, v]) => acc + v, 0);
        const labels = top.map(([k]) => k).concat(outros > 0 ? ['Outros'] : []);
        const valores = top.map(([, v]) => v).concat(outros > 0 ? [outros] : []);

        
        this.barCharts = [
          this.barCharts[0],
          {
            ...this.barCharts[1],
            barChartData: {
              labels,
              datasets: [{ label: 'Despesas', data: valores }]
            }
          }
        ];
      },
      error: err => console.error('Erro natureza de custo:', err)
    });
  }

  gerarCores(tamanho: number) {
    const cores = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'];
    return Array.from({ length: tamanho }, (_, i) => cores[i % cores.length]);
  }

  entrar() {
    this.router.navigate(['/home']);
  }

  // Helpers
  private brl(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  private parseBRL(str: string) {
    // "R$ 12.345,67" -> 12345.67
    return Number((str || '0').replace(/\s|R\$/g, '').replace(/\./g, '').replace(',', '.')) || 0;
  }
  private toShortDate(iso: string) { return new Date(iso).toLocaleDateString(); }
  private toNumber(x?: string | null) {
    if (!x) return 0;
    // tenta "1.234,56" e "1234.56"
    const canon = x.includes(',') && x.includes('.') ? x.replace(/\./g, '').replace(',', '.') : x.replace(',', '.');
    const n = Number(canon);
    return isNaN(n) ? 0 : n;
  }
}

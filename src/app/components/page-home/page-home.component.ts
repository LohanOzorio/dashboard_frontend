import { Component, OnInit, signal } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ChartMixedCardComponent } from '../chart-mixed-card/chart-mixed-card.component';
import { TesteQuadradoComponent } from '../teste-quadrado/teste-quadrado.component';

import { ApiService } from '../../services/api.service';
import { Faturamento } from '../../models/faturamento.model';
import { Meta } from '../../models/meta.model';
import { NaturezaCusto } from '../../models/naturezacusto.model';


type ChartData = { labels: string[]; datasets: any[] };

interface BarChartCfg {
  title: string;
  barChartData: ChartData;
  barChartOptions: any;
}

interface HighlightChartCfg {
  title: string;
  highlightChartData: ChartData;
  highlightChartOptions: any;
}

interface MixedChartCfg {
  title: string;
  mixedChartData: ChartData;
  mixedChartOptions: any;
}

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, InfoCardComponent, HighlightChartCardComponent, ChartCardComponent, ChartMixedCardComponent],
  selector: 'page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
})
export class PageHomeComponent implements OnInit {

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private api: ApiService
  ) {}

  
  faturamentoTotal = signal<string>('R$ 0,00');
  metaAtingidaPct = signal<string>('0.0');
  inadimplencias = signal<string>('4,5'); 
  recebimentosTotais = signal<string>('R$ 0,00');

 
  barCharts: BarChartCfg[] = [
    {
      title: 'Faturamento por Mês',
      barChartData: { labels: [], datasets: [{ label: 'Faturamento', data: [] }] },
      barChartOptions: {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: 'Faturamento por Mês (R$)' } },
        scales: { y: { beginAtZero: true } }
      }
    },
    {
      title: 'Top Centros de Custo',
      barChartData: { labels: [], datasets: [{ label: 'Despesas', data: [] }] },
      barChartOptions: {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: 'Top 8 Centros de Custo (R$)' } },
        scales: { y: { beginAtZero: true } }
      }
    }
  ];

  highlightCharts: HighlightChartCfg[] = [
    {
      title: 'Faturamento Diário (Mês Atual)',
      highlightChartData: { labels: [], datasets: [{ label: 'Faturamento', data: [], fill: false }] },
      highlightChartOptions: { responsive: true }
    }
  ];

  mixedCharts: MixedChartCfg[] = [
    {
      title: 'Faturamento Mensal (Barra) x Meta Total (Linha)',
      mixedChartData: { labels: [], datasets: [] },
      mixedChartOptions: { responsive: true }
    }
  ];

  ngOnInit() {
    this.carregarDados();
  }

  private carregarDados() {
  
    this.api.getFaturamento().subscribe({
      next: (rows: Faturamento[]) => {
        const ordenados = [...rows].sort(
          (a, b) => new Date(a.data_emissao).getTime() - new Date(b.data_emissao).getTime()
        );

       
        const total = ordenados.reduce((acc, r) => acc + (r.valor_nota ?? 0), 0);
        this.faturamentoTotal.set(this.brl(total));
        this.recebimentosTotais.set(this.brl(total));

        
        const mapaMes: Record<string, number> = {};
        for (const f of ordenados) {
          const d = new Date(f.data_emissao);
          const key = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
          mapaMes[key] = (mapaMes[key] ?? 0) + (f.valor_nota ?? 0);
        }
        const labelsMes = Object.keys(mapaMes);
        const valoresMes = labelsMes.map(l => mapaMes[l]);

        
        this.barCharts = [
          {
            ...this.barCharts[0],
            barChartData: { labels: labelsMes, datasets: [{ label: 'Faturamento', data: valoresMes }] }
          },
          this.barCharts[1]
        ];

        
        const now = new Date();
        const m = now.getMonth(), y = now.getFullYear();
        const mapaDia: Record<string, number> = {};
        for (const f of ordenados) {
          const d = new Date(f.data_emissao);
          if (d.getMonth() === m && d.getFullYear() === y) {
            const key = String(d.getDate()).padStart(2, '0');
            mapaDia[key] = (mapaDia[key] ?? 0) + (f.valor_nota ?? 0);
          }
        }
        const labelsDia = Object.keys(mapaDia).sort((a, b) => Number(a) - Number(b));
        const valoresDia = labelsDia.map(l => mapaDia[l]);

        this.highlightCharts = [
          {
            ...this.highlightCharts[0],
            highlightChartData: { labels: labelsDia, datasets: [{ label: 'Faturamento', data: valoresDia, fill: false }] }
          }
        ];

        
        this.api.getMetas().subscribe({
          next: (metas: Meta[]) => {
            const ordenadas = [...metas].sort(
              (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
            );
            const last = ordenadas.length ? ordenadas[ordenadas.length - 1] : undefined;
            const ts = last?.ts ?? 0;
            const tn = last?.tn ?? 0;
            const metaTotal = last?.total ?? (ts + tn);

            
            const atingidoMes = valoresDia.reduce((acc, v) => acc + v, 0);
            const pct = metaTotal > 0 ? Math.min(100, (atingidoMes / metaTotal) * 100) : 0;
            this.metaAtingidaPct.set(pct.toFixed(1));

            
            const linhaMeta = labelsMes.map(() => metaTotal);
            this.mixedCharts = [
              {
                ...this.mixedCharts[0],
                mixedChartData: {
                  labels: labelsMes,
                  datasets: [
                    { type: 'bar', label: 'Faturamento', data: valoresMes },
                    { type: 'line', label: 'Meta Total', data: linhaMeta }
                  ]
                }
              }
            ];
          },
          error: (e) => console.error('Erro metas:', e)
        });
      },
      error: (e) => console.error('Erro faturamento:', e)
    });

    
    this.api.getNaturezaCusto().subscribe({
      next: (rows: NaturezaCusto[]) => {
        const somaPorCusto: Record<string, number> = {};
        for (const r of rows) {
          const chave = (r.desc_custo ?? r.desc_grupo ?? 'Sem classificação').trim();
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
            barChartData: { labels, datasets: [{ label: 'Despesas', data: valores }] }
          }
        ];
      },
      error: (e) => console.error('Erro natureza de custo:', e)
    });
  }

  
  async abrirModal() {
    const modal = await this.modalCtrl.create({ component: TesteQuadradoComponent });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('Modal fechado com:', data, role);
  }

  entrar() {
    this.router.navigate(['/Faturamento']);
  }

  
  private brl(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  private toNumber(x?: string | null) {
    if (!x) return 0;
    
    const canon = x.includes(',') && x.includes('.')
      ? x.replace(/\./g, '').replace(',', '.')
      : x.replace(',', '.');
    const n = Number(canon);
    return isNaN(n) ? 0 : n;
  }
}

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { TabIndicadorComponent } from '../tab-indicador/tab-indicador.component';
import { ChartMixedCardComponent } from '../chart-mixed-card/chart-mixed-card.component';
import { TesteQuadradoComponent } from '../teste-quadrado/teste-quadrado.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

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

  mostrar: boolean = false;

  barCharts: any[] = [
    {
      title: 'Faturamento Mensal',
      barChartData: {
        labels: [],
        datasets: [{
          label: 'Faturamento',
          data: [],
          backgroundColor: []
        }]
      },
      barChartOptions: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Faturamento por Mês' }
        }
      }
    },
    {
      title: 'Despesas',
      barChartData: {
        labels: [],
        datasets: [{ label: 'Despesas', data: [] }]
      },
      barChartOptions: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Despesas por Setor' }
        }
      }
    }
  ];

  highlightCharts: any[] = [
    {
      title: 'Meta Atingida',
      highlightChartData: {
        labels: ['Atingido', 'Restante'],
        datasets: [{ label: 'Meta', data: [0, 0] }]
      },
      highlightChartOptions: { responsive: true }
    }
  ];

  mixedCharts: any[] = []; 

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    // 1️⃣ Faturamento Mensal
    this.api.getFaturamento().subscribe({
      next: (res: any[]) => {
        if(res.length > 0) {
          this.barCharts[0].barChartData.labels = res.map(r => r.mes);
          this.barCharts[0].barChartData.datasets[0].data = res.map(r => r.valor);
          this.barCharts[0].barChartData.datasets[0].backgroundColor = this.gerarCores(res.length);
        }
      },
      error: err => console.error('Erro faturamento:', err)
    });

    // 2️⃣ Despesas / Natureza de Custo
    this.api.getNaturezaCusto().subscribe({
      next: (res: any[]) => {
        if(res.length > 0) {
          this.barCharts[1].barChartData.labels = res.map(r => r.setor);
          this.barCharts[1].barChartData.datasets[0].data = res.map(r => r.valor);
        }
      },
      error: err => console.error('Erro despesas:', err)
    });

    // 3️⃣ Metas
    this.api.getMetas().subscribe({
      next: (res: any) => {
        this.highlightCharts[0].highlightChartData.datasets[0].data = [res.atingido, res.restante];
      },
      error: err => console.error('Erro metas:', err)
    });
  }

  gerarCores(tamanho: number) {
    const cores = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'];
    return Array.from({ length: tamanho }, (_, i) => cores[i % cores.length]);
  }

  entrar() {
    this.router.navigate(['/home']);
  }
}

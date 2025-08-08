import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component'; 
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ChartType } from 'chart.js';
import { TabIndicadorComponent } from '../tab-indicador/tab-indicador.component';
import { Router } from '@angular/router';
import { ChartMixedCardComponent } from '../chart-mixed-card/chart-mixed-card.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    InfoCardComponent,
    HighlightChartCardComponent,
    ChartCardComponent,
    TabIndicadorComponent,
    ChartMixedCardComponent
  ],
  selector: 'page-faturamento-meta',
  templateUrl: './page-faturamento-meta.component.html',
  styleUrls: ['./page-faturamento-meta.component.scss'],
})
export class PageFaturamentoMetaComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  
  barCharts = [
    {
      title: 'Faturamento Mensal',
      barChartData: {
        labels: [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        datasets: [
          {
            label: 'Faturamento',
            data: [100, 250, 300, 500, 400, 600, 700, 800, 900, 1000, 1100, 1200],
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
              '#9966FF', '#FF9F40', '#FF6384', '#36A2EB',
              '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ]
          }
        ]
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
        labels: ['Salários', 'Marketing', 'TI', 'Logística'],
        datasets: [{ label: 'Despesas', data: [500, 300, 200, 400] }]
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

  // ----- Gráficos de Destaque (HighlightChartCardComponent) -----
  highlightCharts = [
    {
      title: 'Meta Atingida',
      highlightChartData: {
        labels: ['Atingido', 'Restante'],
        datasets: [{ label: 'Meta', data: [75, 25] }]
      },
      highlightChartOptions: { responsive: true }
    },
    {
      title: 'Crescimento',
      highlightChartData: {
        labels: ['Atual', 'Anterior'],
        datasets: [{ label: 'Crescimento', data: [1200, 950] }]
      },
      highlightChartOptions: { responsive: true }
    }
  ];

  // ----- Gráficos Mistos (ChartMixedCardComponent) -----
  mixedCharts = [
    {
      title: 'Comparativo Receita x Meta',
      mixedChartData: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr'],
        datasets: [
          { type: 'bar', label: 'Receita', data: [500, 600, 550, 700] },
          { type: 'line', label: 'Meta', data: [450, 650, 500, 720] }
        ]
      },
      mixedChartOptions: { responsive: true }
    }
  ];

  entrar() {
    this.router.navigate(['/home']); 
  }
}

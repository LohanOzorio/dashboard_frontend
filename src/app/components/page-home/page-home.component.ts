import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component'; 
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { ChartMixedCardComponent } from '../chart-mixed-card/chart-mixed-card.component';


@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, InfoCardComponent, HighlightChartCardComponent, ChartCardComponent, ChartMixedCardComponent],
  selector: 'page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
})
export class PageHomeComponent {

  constructor(private router: Router) {}

  ngOnInit() {}

  entrar() {
    this.router.navigate(['/Faturamento']); 
  }

  // -------- Dados para ChartCardComponent (bar charts) --------
  barCharts = [
    {
      title: 'Vendas',
      barChartData: {
        labels: ['Produto A', 'Produto B', 'Produto C'],
        datasets: [{ label: 'Vendas', data: [100, 250, 300] }]
      },
      barChartOptions: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Gráfico de Vendas' }
        }
      }
    },
    {
      title: 'Lucros',
      barChartData: {
        labels: ['Jan', 'Fev', 'Mar'],
        datasets: [{ label: 'Lucro', data: [400, 500, 450] }]
      },
      barChartOptions: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Lucros Mensais' }
        }
      }
    },
    {
      title: 'Despesas',
      barChartData: {
        labels: ['Marketing', 'Operacional', 'Outros'],
        datasets: [{ label: 'Despesas', data: [120, 200, 80] }]
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

  // -------- Dados para HighlightChartCardComponent --------
  highlightCharts = [
    {
      title: 'Destaque A',
      highlightChartData: {
        labels: ['Item 1', 'Item 2'],
        datasets: [{ label: 'Dados A', data: [60, 40] }]
      },
      highlightChartOptions: {
        responsive: true
      }
    },
    {
      title: 'Destaque B',
      highlightChartData: {
        labels: ['Item X', 'Item Y'],
        datasets: [{ label: 'Dados B', data: [80, 20] }]
      },
      highlightChartOptions: {
        responsive: true
      }
    },
    {
      title: 'Destaque C',
      highlightChartData: {
        labels: ['A', 'B'],
        datasets: [{ label: 'Dados C', data: [55, 45] }]
      },
      highlightChartOptions: {
        responsive: true
      }
    }
  ];

  // -------- Dados para ChartMixedCardComponent --------
  mixedCharts = [
    {
      title: 'Combinado 1',
      mixedChartData: {
        labels: ['Q1', 'Q2', 'Q3'],
        datasets: [
          { type: 'bar', label: 'Faturamento', data: [100, 200, 150] },
          { type: 'line', label: 'Meta', data: [120, 180, 160] }
        ]
      },
      mixedChartOptions: {
        responsive: true
      }
    },
    {
      title: 'Combinado 2',
      mixedChartData: {
        labels: ['Jan', 'Fev', 'Mar'],
        datasets: [
          { type: 'bar', label: 'Receita', data: [300, 400, 500] },
          { type: 'line', label: 'Projeção', data: [320, 390, 510] }
        ]
      },
      mixedChartOptions: {
        responsive: true
      }
    },
    {
      title: 'Combinado 3',
      mixedChartData: {
        labels: ['Dia 1', 'Dia 2', 'Dia 3'],
        datasets: [
          { type: 'bar', label: 'Visitas', data: [150, 180, 170] },
          { type: 'line', label: 'Objetivo', data: [160, 160, 160] }
        ]
      },
      mixedChartOptions: {
        responsive: true
      }
    }
  ];
}

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';  
import { InfoCardComponent } from '../info-card/info-card.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    HighlightChartCardComponent,
    ChartCardComponent,
    InfoCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  infoCards = [
    { title: 'Faturamento / Hora', value: 'R$ 1.000', unit: '/h', color: 'success' },
    { title: 'Novos Clientes', value: '350', color: 'tertiary' },
    { title: 'Vendas Hoje', value: '520', color: 'warning' },
    { title: 'Erros no Sistema', value: '2', color: 'danger' },
  ];

  barChartTitles = ['Vendas por Produto', 'Outro Gráfico', 'Mais um Gráfico'];

  lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Crescimento',
      data: [65, 59, 80, 81, 56],
      fill: true,
      borderColor: 'blue',
      tension: 0.4
    }]
  };

  barChartData = {
    labels: ['Produto A', 'Produto B', 'Produto C'],
    datasets: [{
      label: 'Vendas',
      data: [300, 500, 100],
      backgroundColor: ['red', 'blue', 'green']
    }]
  };

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
}

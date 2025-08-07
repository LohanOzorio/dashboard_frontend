import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component'; 
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ChartType } from 'chart.js';
import { TabIndicadorComponent } from '../tab-indicador/tab-indicador.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, InfoCardComponent, HighlightChartCardComponent, ChartCardComponent,TabIndicadorComponent],
  selector: 'page-faturamento-meta',
  templateUrl: './page-faturamento-meta.component.html',
  styleUrls: ['./page-faturamento-meta.component.scss'],
})
export class PageFaturamentoMetaComponent {

  constructor(private router: Router) {}

  ngOnInit() {}

 t = '';

  chartData = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
      {
        label: 'Faturamento',
        data: [100, 250, 300, 500, 400, 600, 700, 800, 900, 1000, 1100, 1200],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  };

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Vendas'
      }
    }
  };

  type: ChartType = 'bar';

  entrar() {
    this.router.navigate(['/home']); 
  }
 
}

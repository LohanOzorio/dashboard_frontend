import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component'; 
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ChartType } from 'chart.js';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, InfoCardComponent, HighlightChartCardComponent, ChartCardComponent],
  selector: 'page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
})
export class PageHomeComponent {

  t = '';

  chartData = {
    labels: ['Produto A', 'Produto B', 'Produto C','Produto D'],
    datasets: [
      {
        label: 'Vendas',
        data: [100, 250, 300,500],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
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
        text: 'Indicadores gerais'
      }
    }
  };

  type: ChartType = 'bar';

  constructor(private router: Router) {}

  ngOnInit() {}

  entrar() {
    this.router.navigate(['/Faturamento']); 
  }
}

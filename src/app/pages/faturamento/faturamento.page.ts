import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartCardComponent } from 'src/app/components/chart-card/chart-card.component';
import { HighlightChartCardComponent } from 'src/app/components/highlight-chart-card/highlight-chart-card.component';
import { InfoCardComponent } from 'src/app/components/info-card/info-card.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { IonMenuComponent } from 'src/app/components/ion-menu/ion-menu.component';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-faturamento',
  templateUrl: './faturamento.page.html',
  styleUrls: ['./faturamento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChartCardComponent, HighlightChartCardComponent, InfoCardComponent, DashboardComponent, IonMenuComponent]
})
export class FaturamentoPage {

   t = 'Teste de Gráfico';

  chartData = {
    labels: ['Produto A', 'Produto B', 'Produto C'],
    datasets: [
      {
        label: 'Vendas',
        data: [100, 250, 300],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
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

  
}
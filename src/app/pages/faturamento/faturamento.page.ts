import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartType } from 'chart.js';
import { PageFaturamentoMetaComponent } from 'src/app/components/page-faturamento-meta/page-faturamento-meta.component';

@Component({
  selector: 'app-faturamento',
  templateUrl: './faturamento.page.html',
  styleUrls: ['./faturamento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,PageFaturamentoMetaComponent]
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
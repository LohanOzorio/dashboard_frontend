import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';


@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, NgxEchartsModule],
  selector: 'chart-mixed-card',
  templateUrl: './chart-mixed-card.component.html',
  styleUrls: ['./chart-mixed-card.component.scss'],
})
export class ChartMixedCardComponent {
   @Input() data: any[][] = []; // receber dados no formato que você mostrou

  options: any = {};

  ngOnInit() {
    this.options = this.getOptions(this.data);
  }

  getOptions(dataset: any[][]) {
    return {
      legend: {},
      tooltip: {},
      dataset: {
        source: dataset
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: Array(dataset[0].length - 1).fill({ type: 'bar' }) 

    }

}

}

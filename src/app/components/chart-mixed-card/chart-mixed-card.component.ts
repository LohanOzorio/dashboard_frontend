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
  @Input() title!: string;
   @Input() chartOptions: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  };

}
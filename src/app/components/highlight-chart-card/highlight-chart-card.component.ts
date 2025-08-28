import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-highlight-chart-card',
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
    NgxEchartsModule 
  ],
  templateUrl: './highlight-chart-card.component.html',
  styleUrls: ['./highlight-chart-card.component.scss']
})
export class HighlightChartCardComponent {
  @Input() title!: string;
  @Input() chartOptions!: EChartsOption;
}
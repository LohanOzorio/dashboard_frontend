import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() chartData!: any;
  @Input() chartOptions!: any;
  @Input() type: ChartType = 'bar'; 

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  ngAfterViewInit() {
    try {
      console.log('Canva funcionando:', this.chartCanvas);
      new Chart(this.chartCanvas.nativeElement, {
        type: this.type,
        data: this.chartData,
        options: this.chartOptions,
      });
    } catch (e: unknown) {
      console.error('Error initializing chart:', e);
    }
  }
}

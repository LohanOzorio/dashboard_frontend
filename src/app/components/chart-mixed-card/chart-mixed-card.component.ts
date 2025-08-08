import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule],
  selector: 'chart-mixed-card',
  templateUrl: './chart-mixed-card.component.html',
  styleUrls: ['./chart-mixed-card.component.scss'],
})
export class ChartMixedCardComponent  implements AfterViewInit {

  @Input() title!: string;
  @Input() mixedChartData!: any;     
  @Input() mixedChartOptions!: any;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        if (!this.chartCanvas?.nativeElement) return;

        new Chart(this.chartCanvas.nativeElement, {
          type: 'bar', 
          data: this.mixedChartData,
          options: this.mixedChartOptions,
        });
      } catch (e) {
        console.error('Erro ao inicializar o gráfico:', e);
      }
    }, 0);
  }

}

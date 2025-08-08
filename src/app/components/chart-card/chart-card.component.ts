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
  @Input() barChartData!: any;
  @Input() barChartOptions!: any;
  @Input() type: ChartType = 'bar'; 

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

 ngAfterViewInit() {
  setTimeout(() => {
    try {
      console.log('Canvas:', this.chartCanvas?.nativeElement);
      console.log('Data:', this.barChartData);

      if (!this.chartCanvas?.nativeElement) return;

      new Chart(this.chartCanvas.nativeElement, {
        type: this.type,
        data: this.barChartData,
        options: this.barChartOptions,
      });
    } catch (e) {
      console.error('Erro ao inicializar o gráfico:', e);
    }
  }, 0); 
}

}

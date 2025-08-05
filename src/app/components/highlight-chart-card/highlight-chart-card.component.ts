import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-highlight-chart-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './highlight-chart-card.component.html',
  styleUrls: ['./highlight-chart-card.component.scss']
})
export class HighlightChartCardComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() chartData!: any;
  @Input() chartOptions!: any;

  @ViewChild('highlightCanvas') highlightCanvas!: ElementRef;

  ngAfterViewInit() {
    try {
      console.log('Canva funcionando:', this.highlightCanvas);
      new Chart(this.highlightCanvas.nativeElement, {
        type: 'line',
        data: this.chartData,
        options: this.chartOptions,
      });
    } catch (e: unknown) {
    console.error('Error initializing chart:', e);
  }

  }

 }

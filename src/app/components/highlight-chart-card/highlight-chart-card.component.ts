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
  @Input() highlightChartData!: any;
  @Input() highlightChartOptions!: any;

  @ViewChild('highlightCanvas') highlightCanvas!: ElementRef;

  ngAfterViewInit() {
    try {
      console.log('Canva funcionando:', this.highlightCanvas);
      new Chart(this.highlightCanvas.nativeElement, {
        type: 'bubble',
        data: this.highlightChartData,
        options: this.highlightChartOptions,
      });
    } catch (e: unknown) {
    console.error('Error initializing chart:', e);
  }

  }

 }

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
  
}
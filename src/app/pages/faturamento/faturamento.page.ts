import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartCardComponent } from 'src/app/components/chart-card/chart-card.component';
import { HighlightChartCardComponent } from 'src/app/components/highlight-chart-card/highlight-chart-card.component';
import { InfoCardComponent } from 'src/app/components/info-card/info-card.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';


@Component({
  selector: 'app-faturamento',
  templateUrl: './faturamento.page.html',
  styleUrls: ['./faturamento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChartCardComponent, HighlightChartCardComponent, InfoCardComponent, DashboardComponent]
})
export class FaturamentoPage {
  
}
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
import { HighlightChartCardComponent } from '../highlight-chart-card/highlight-chart-card.component'; 
import { ChartCardComponent } from '../chart-card/chart-card.component';

@Component({
  selector: 'ion-menu-component',
  standalone: true,
  templateUrl: './ion-menu.component.html',
  styleUrls: ['./ion-menu.component.scss'],
  imports: [
    CommonModule, IonicModule, InfoCardComponent, HighlightChartCardComponent, ChartCardComponent
  ],
})
export class IonMenuComponent {}



import { Component, Input, ViewChild,ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'kpi-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class kpiCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() unit?: string;
  @Input() color: string = 'primary';


}

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ion-menu-component',
  standalone: true,
  templateUrl: './ion-menu.component.html',
  styleUrls: ['./ion-menu.component.scss'],
  imports: [
    CommonModule, IonicModule ],
})
export class IonMenuComponent {}



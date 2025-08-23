import { Component, Input, OnInit } from '@angular/core';
import { 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header-geral',
  standalone: true,
  imports: [
    IonButtons, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonMenuButton 
  ],
  templateUrl: './header-geral.component.html',
  styleUrls: ['./header-geral.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() headerTitle: string = 'Título Padrão'; 

  constructor() { }

  ngOnInit() {}

}
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header-geral',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton],
  templateUrl: './header-geral.component.html',
  styleUrls: ['./header-geral.component.scss'],
})
export class HeaderGeralComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}

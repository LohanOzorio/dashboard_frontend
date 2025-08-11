import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IonMenuComponent } from './components/ion-menu/ion-menu.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet,IonMenuComponent],
})
export class AppComponent {
  constructor() {}
}

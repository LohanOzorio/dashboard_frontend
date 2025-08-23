import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuButtonComponent } from '../btn-menu/btn-menu.component';
@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
  standalone: true,
  imports: [IonicModule, MenuButtonComponent]
})
export class MenuContentComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}

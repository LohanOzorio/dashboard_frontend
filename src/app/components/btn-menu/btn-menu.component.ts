import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'btn-menu',
  templateUrl: './btn-menu.component.html',
  styleUrls: ['./btn-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule]
})

export class MenuButtonComponent {
 
  @Input() titulo: string = 'Link';

  
  @Input() routerLink: string | any[] = '/';

  constructor() {}
}


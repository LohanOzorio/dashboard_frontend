import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageHomeComponent } from 'src/app/components/page-home/page-home.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, PageHomeComponent]
})
export class HomePage implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PageFaturamentoGeralComponent } from 'src/app/components/page-faturamento-geral/page-faturamento-geral.component';



@Component({
  selector: 'app-faturamento-geral',
  templateUrl: './faturamento-geral.page.html',
  styleUrls: ['./faturamento-geral.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,PageFaturamentoGeralComponent]
})
export class FaturamentoGeralPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

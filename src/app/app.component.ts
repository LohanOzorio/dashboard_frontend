import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuContentComponent } from './components/menu-content/menu-content.component';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule  } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [MenuContentComponent,IonicModule, CommonModule, HttpClientModule,NgxEchartsModule],
})
export class AppComponent {
  faturamento: any;
  metas: any;
  natureza: any;

  constructor(private api: ApiService) {}

  carregarFaturamento() {
    this.api.getFaturamento().subscribe({
      next: res => this.faturamento = res,
      error: err => console.error('Erro faturamento:', err)
    });
  }

  carregarMetas() {
    this.api.getMetas().subscribe({
      next: res => this.metas = res,
      error: err => console.error('Erro metas:', err)
    });
  }

  carregarNatureza() {
    this.api.getNaturezaCusto().subscribe({
      next: res => this.natureza = res,
      error: err => console.error('Erro natureza:', err)
    });
  }

  
}

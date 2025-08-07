import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'tab-indicador',
  templateUrl: './tab-indicador.component.html',
  styleUrls: ['./tab-indicador.component.scss'],
})
export class TabIndicadorComponent  {

  dados = [
    { mes: 'JAN/2025', valor: 1450000, valormota: 1497476.04 },
    { mes: 'FEV/2025', valor: 1450000, valormota: 1094746.81 },
    { mes: 'MAR/2025', valor: 1450000, valormota: 1672659.92 },
    { mes: 'ABR/2025', valor: 1450000, valormota: 2002458.94 },
    { mes: 'MAI/2025', valor: 1450000, valormota: 850703.11 },
    { mes: 'JUN/2025', valor: 1450000 },
    { mes: 'JUL/2025', valor: 1450000 },
    { mes: 'AGO/2025', valor: 1450000 },
    { mes: 'SET/2025', valor: 1450000 },
    { mes: 'OUT/2025', valor: 1450000 },
    { mes: 'NOV/2025', valor: 1450000 },
    { mes: 'DEZ/2025', valor: 1450000 },
  ];

  get totalValor(): number {
    return this.dados.reduce((acc, item) => acc + item.valor, 0);
  }

  get totalValormota(): number {
    return this.dados.reduce((acc, item) => acc + (item.valormota || 0), 0);
  }

  formatar(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}

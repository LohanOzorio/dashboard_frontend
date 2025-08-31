import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importações do Angular Material
import { MatTableModule } from '@angular/material/table';
import { IonCard } from "@ionic/angular/standalone";


export interface TableColumn {
  key: string;
  label: string;

  formatter?: (value: any, row?: any) => string;
}

@Component({
  selector: 'app-tabela',
  templateUrl: './tab-indicador.component.html',
  styleUrls: ['./tab-indicador.component.scss'],
  standalone: true,
  imports: [ CommonModule, MatTableModule] 
})
export class TabelaComponent {
  @Input({ required: true }) data!: any[];
  @Input({ required: true }) columns!: TableColumn[];

  // As colunas que o MatTable vai renderizar
  displayedColumns: string[] = [];

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.key);
  }
}
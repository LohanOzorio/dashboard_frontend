import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';


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
  imports: [CommonModule, MatTableModule]
})
export class TabelaComponent {
  @Input({ required: true }) data!: any[];
  @Input({ required: true }) columns!: TableColumn[];

  displayedColumns: string[] = [];

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.key);
  }

  getFooterValue(column: TableColumn): string {
    if (!this.data || this.data.length === 0) return '';

    // Se for a primeira coluna (data), retorna "TOTAL"
    if (column === this.columns[0]) {
      return 'TOTAL';
    }

    // Soma os valores da coluna
    const total = this.data.reduce((acc, row) => acc + (Number(row[column.key]) || 0), 0);

    // Aplica o formatter, se existir
    return column.formatter ? column.formatter(total) : total.toString();
  }
}

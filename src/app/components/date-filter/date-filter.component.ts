import { Component, Output, EventEmitter } from '@angular/core'; 
import { IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonList, IonItem } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  standalone: true,
  imports: [IonList, IonDatetime, IonLabel, IonSegmentButton, IonSegment, IonItem, FormsModule, CommonModule]  
})
export class DateFilterComponent {

  filterType: 'day' | 'month' | 'year' = 'month';
  selectedFilterValue: string | number | Date = 2024; 
  
  // Tipagem corrigida
  @Output() filterSelected = new EventEmitter<{ type: 'day' | 'month' | 'year', value: any }>();

  constructor() {}

  onFilterTypeChange() {
    // Pode emitir o valor atual do filtro ao trocar o tipo
    this.emitCurrentFilter();
  }

  handleDateChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.selectedFilterValue = selectedDate;
    this.filterSelected.emit({ type: 'day', value: selectedDate });
  }

  handleMonthChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    const selectedMonth = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0');
    this.selectedFilterValue = selectedMonth;
    this.filterSelected.emit({ type: 'month', value: selectedMonth });
  }

  handleYearChange(event: any) {
    const selectedYear = new Date(event.detail.value).getFullYear();
    this.selectedFilterValue = selectedYear;
    this.filterSelected.emit({ type: 'year', value: selectedYear });
  }

  private emitCurrentFilter() {
    // Emite o valor atual dependendo do tipo de filtro
    if (this.filterType === 'day' && this.selectedFilterValue instanceof Date) {
      this.filterSelected.emit({ type: 'day', value: this.selectedFilterValue });
    } else if (this.filterType === 'month' && typeof this.selectedFilterValue === 'string') {
      this.filterSelected.emit({ type: 'month', value: this.selectedFilterValue });
    } else if (this.filterType === 'year' && typeof this.selectedFilterValue === 'number') {
      this.filterSelected.emit({ type: 'year', value: this.selectedFilterValue });
    }
  }
}

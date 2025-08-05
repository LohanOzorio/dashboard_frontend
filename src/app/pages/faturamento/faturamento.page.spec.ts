import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaturamentoPage } from './faturamento.page';

describe('FaturamentoPage', () => {
  let component: FaturamentoPage;
  let fixture: ComponentFixture<FaturamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FaturamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

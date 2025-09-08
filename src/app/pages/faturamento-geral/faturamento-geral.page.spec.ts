import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaturamentoGeralPage } from './faturamento-geral.page';

describe('FaturamentoGeralPage', () => {
  let component: FaturamentoGeralPage;
  let fixture: ComponentFixture<FaturamentoGeralPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FaturamentoGeralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

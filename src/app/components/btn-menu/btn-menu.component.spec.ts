import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BtnMenuComponent } from './btn-menu.component';

describe('BtnMenuComponent', () => {
  let component: BtnMenuComponent;
  let fixture: ComponentFixture<BtnMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BtnMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

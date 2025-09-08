import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageFaturamentoGeralComponent } from './page-faturamento-geral.component';

describe('PageFaturamentoGeralComponent', () => {
  let component: PageFaturamentoGeralComponent;
  let fixture: ComponentFixture<PageFaturamentoGeralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFaturamentoGeralComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageFaturamentoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

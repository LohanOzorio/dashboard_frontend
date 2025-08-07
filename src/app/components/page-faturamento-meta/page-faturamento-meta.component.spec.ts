import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageFaturamentoMetaComponent } from './page-faturamento-meta.component';

describe('PageFaturamentoMetaComponent', () => {
  let component: PageFaturamentoMetaComponent;
  let fixture: ComponentFixture<PageFaturamentoMetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFaturamentoMetaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageFaturamentoMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

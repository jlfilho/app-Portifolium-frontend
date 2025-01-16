import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsAtividadesComponent } from './cards-atividades.component';

describe('CardsAtividadesComponent', () => {
  let component: CardsAtividadesComponent;
  let fixture: ComponentFixture<CardsAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsAtividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

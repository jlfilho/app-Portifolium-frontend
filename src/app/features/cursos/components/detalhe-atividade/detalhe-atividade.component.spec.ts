import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheAtividadeComponent } from './detalhe-atividade.component';

describe('DetalheAtividadeComponent', () => {
  let component: DetalheAtividadeComponent;
  let fixture: ComponentFixture<DetalheAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheAtividadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalheAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

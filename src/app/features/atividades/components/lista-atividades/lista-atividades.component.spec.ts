import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ListaAtividadesComponent } from './lista-atividades.component';
import { AtividadesService } from '../../services/atividades.service';

describe('ListaAtividadesComponent', () => {
  let component: ListaAtividadesComponent;
  let fixture: ComponentFixture<ListaAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListaAtividadesComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [AtividadesService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




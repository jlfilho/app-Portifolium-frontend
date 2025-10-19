import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CursosUsuarioDialogComponent } from './cursos-usuario-dialog.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('CursosUsuarioDialogComponent', () => {
  let component: CursosUsuarioDialogComponent;
  let fixture: ComponentFixture<CursosUsuarioDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CursosUsuarioDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CursosUsuarioDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            usuario: {
              id: 1,
              nome: 'João Silva',
              email: 'joao@test.com',
              cpf: '123.456.789-00',
              role: 'PROFESSOR',
              cursos: [
                { id: 1, nome: 'Angular', ativo: true },
                { id: 2, nome: 'TypeScript', ativo: false }
              ]
            }
          }
        },
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when close is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should count active courses correctly', () => {
    expect(component.getCursosAtivos()).toBe(1);
  });

  it('should count inactive courses correctly', () => {
    expect(component.getCursosInativos()).toBe(1);
  });
});


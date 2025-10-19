import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormUsuarioComponent } from './form-usuario.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('FormUsuarioComponent', () => {
  let component: FormUsuarioComponent;
  let fixture: ComponentFixture<FormUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUsuarioComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.usuarioForm).toBeDefined();
    expect(component.usuarioForm.get('role')?.value).toBe('ALUNO');
  });

  it('should validate required fields', () => {
    const form = component.usuarioForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      nome: 'João Silva',
      email: 'joao@test.com',
      cpf: '123.456.789-00',
      senha: '123456',
      role: 'PROFESSOR'
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.usuarioForm.get('email');

    emailControl?.setValue('email-invalido');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate CPF pattern', () => {
    const cpfControl = component.usuarioForm.get('cpf');

    cpfControl?.setValue('12345678900');
    expect(cpfControl?.hasError('pattern')).toBeTruthy();

    cpfControl?.setValue('123.456.789-00');
    expect(cpfControl?.hasError('pattern')).toBeFalsy();
  });

  it('should return correct role color', () => {
    expect(component.getRoleColor('ADMINISTRADOR')).toBe('warn');
    expect(component.getRoleColor('PROFESSOR')).toBe('primary');
    expect(component.getRoleColor('ALUNO')).toBe('accent');
  });

  it('should return correct role icon', () => {
    expect(component.getRoleIcon('ADMINISTRADOR')).toBe('admin_panel_settings');
    expect(component.getRoleIcon('PROFESSOR')).toBe('school');
    expect(component.getRoleIcon('ALUNO')).toBe('person');
  });
});

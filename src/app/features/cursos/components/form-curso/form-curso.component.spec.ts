import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCursoComponent } from './form-curso.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('FormCursoComponent', () => {
  let component: FormCursoComponent;
  let fixture: ComponentFixture<FormCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCursoComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.cursoForm).toBeDefined();
    expect(component.cursoForm.get('ativo')?.value).toBe(true);
  });

  it('should validate required fields', () => {
    const form = component.cursoForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      nome: 'Curso Teste',
      ativo: true
    });

    expect(form.valid).toBeTruthy();
  });

  it('should validate minimum length', () => {
    const nomeControl = component.cursoForm.get('nome');

    nomeControl?.setValue('AB');
    expect(nomeControl?.hasError('minlength')).toBeTruthy();

    nomeControl?.setValue('Curso Teste');
    expect(nomeControl?.hasError('minlength')).toBeFalsy();
  });

  it('should have correct form structure', () => {
    const form = component.cursoForm;
    expect(form.contains('nome')).toBeTruthy();
    expect(form.contains('ativo')).toBeTruthy();
  });
});


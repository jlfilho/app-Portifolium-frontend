import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ChangePasswordDialogComponent', () => {
  let component: ChangePasswordDialogComponent;
  let fixture: ComponentFixture<ChangePasswordDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ChangePasswordDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            usuarioId: 1,
            usuarioNome: 'João Silva'
          }
        },
        provideHttpClient(),
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with false when cancel is clicked', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should validate password match', () => {
    const form = component.passwordForm;

    form.patchValue({
      currentPassword: 'senha123',
      newPassword: 'novaSenha123',
      confirmPassword: 'senhasDiferentes'
    });

    expect(form.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should validate minimum length', () => {
    const newPasswordControl = component.passwordForm.get('newPassword');

    newPasswordControl?.setValue('123');
    expect(newPasswordControl?.hasError('minlength')).toBeTruthy();

    newPasswordControl?.setValue('123456');
    expect(newPasswordControl?.hasError('minlength')).toBeFalsy();
  });
});


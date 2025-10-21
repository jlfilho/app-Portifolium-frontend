import { Injectable, ComponentRef, ApplicationRef, Injector, createComponent, EnvironmentInjector } from '@angular/core';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {
  private dialogRef: ComponentRef<ConfirmDialogComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(data: ConfirmDialogData): Promise<boolean> {
    return new Promise((resolve) => {
      // Criar o componente usando a nova API
      this.dialogRef = createComponent(ConfirmDialogComponent, {
        environmentInjector: this.injector
      });

      // Configurar os dados
      this.dialogRef.instance.data = data;

      // Configurar os event listeners
      this.dialogRef.instance.cancel.subscribe(() => {
        this.close();
        resolve(false);
      });

      this.dialogRef.instance.confirm.subscribe(() => {
        this.close();
        resolve(true);
      });

      // Adicionar ao DOM
      document.body.appendChild(this.dialogRef.location.nativeElement);
      this.appRef.attachView(this.dialogRef.hostView);

      console.log('🔍 Custom Dialog Aberto:', data);
    });
  }

  private close(): void {
    if (this.dialogRef) {
      this.appRef.detachView(this.dialogRef.hostView);
      this.dialogRef.destroy();
      this.dialogRef = null;
    }
  }
}

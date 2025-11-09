import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

// Services e Models
import { CursosService } from '../../services/cursos.service';
import { Curso } from '../../models/curso.model';
import { TiposCursoService } from '../../services/tipos-curso.service';
import { TipoCurso } from '../../models/tipo-curso.model';
import { extractApiMessage } from '../../../../shared/utils/message.utils';
import { environment } from '../../../../../environments/environment';
import { UnidadesAcademicasService } from '../../../unidades-academicas/services/unidades-academicas.service';
import { UnidadeAcademica } from '../../../unidades-academicas/models/unidade-academica.model';

@Component({
  selector: 'acadmanage-form-curso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  templateUrl: './form-curso.component.html',
  styleUrl: './form-curso.component.css'
})
export class FormCursoComponent implements OnInit, OnDestroy {
  cursoForm!: FormGroup;
  isEditMode = false;
  cursoId?: number;
  isLoading = false;
  isSaving = false;
  isLoadingTipos = false;
  tiposCurso: TipoCurso[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  currentCoverUrl: string | null = null;
  isUploadingCover = false;
  uploadProgress = 0;
  isDragOver = false;
  private fotoCapaPath: string | null = null;
  private readonly filesBaseUrl = `${environment.apiUrl}/files`;
  unidadeAcademicaSearchCtrl: FormControl = new FormControl('');
  unidadesAcademicas: UnidadeAcademica[] = [];
  isLoadingUnidades = false;
  selectedUnidadeAcademica: UnidadeAcademica | null = null;
  private unidadeSearchSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private tiposCursoService: TiposCursoService,
    private unidadesAcademicasService: UnidadesAcademicasService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.initForm();
    this.setupUnidadeSearch();
  }

  ngOnInit(): void {
    this.loadTiposCurso();
    // Verificar se está em modo de edição
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.cursoId = +params['id'];
        this.loadCurso(this.cursoId);
      }
    });
  }

  ngOnDestroy(): void {
    this.revokePreviewUrl();
    this.unidadeSearchSub?.unsubscribe();
  }

  initForm(): void {
    this.cursoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      ativo: [true],
      tipoId: [null, [Validators.required]],
      unidadeAcademicaId: [null, [Validators.required]]
    });
  }

  loadCurso(id: number): void {
    this.isLoading = true;
    console.log('📚 Carregando curso para edição, ID:', id);

    this.cursosService.getCourseById(id).subscribe({
      next: (curso: Curso) => {
        console.log('✅ Curso carregado:', curso);

        if (curso) {
          this.cursoForm.patchValue({
            nome: curso.nome,
            descricao: curso.descricao || '',
            ativo: curso.ativo !== undefined ? curso.ativo : true,
            tipoId: (curso as any).tipoId ?? curso.tipo?.id ?? null,
            unidadeAcademicaId: (curso as any).unidadeAcademicaId ?? curso.unidadeAcademica?.id ?? null
          });
          console.log('📝 Formulário populado:', this.cursoForm.value);
          this.fotoCapaPath = curso.fotoCapa || null;
          this.currentCoverUrl = this.fotoCapaPath ? this.buildImageUrl(this.fotoCapaPath) : null;
          this.setPreviewUrl(this.currentCoverUrl);

          const unidade = (curso as any).unidadeAcademica as UnidadeAcademica | undefined;
          if (unidade) {
            this.setSelectedUnidade(unidade);
          } else {
            const unidadeId = (curso as any).unidadeAcademicaId;
            if (unidadeId) {
              this.fetchUnidadeById(unidadeId);
            }
          }
        } else {
          console.warn('⚠️ Curso não encontrado');
          this.showMessage('Curso não encontrado', 'error');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar curso:', error);
        const apiMessage = extractApiMessage(error);
        const message = apiMessage || (error.status === 404
          ? 'Curso não encontrado'
          : error.status === 403
            ? 'Você não tem permissão para editar este curso'
            : 'Erro ao carregar curso. Tente novamente.');

        this.showMessage(message, 'error');
        this.isLoading = false;
        this.router.navigate(['/cursos']);
      }
    });
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      this.isSaving = true;
      const cursoData: Curso = {
        ...this.cursoForm.value,
        fotoCapa: this.fotoCapaPath || undefined
      };
      if (this.selectedUnidadeAcademica) {
        cursoData.unidadeAcademicaId = this.selectedUnidadeAcademica.id;
      }

      const operation = this.isEditMode && this.cursoId
        ? this.cursosService.updateCourse(this.cursoId, cursoData)
        : this.cursosService.createCourse(cursoData);

      operation.subscribe({
        next: () => {
          this.showMessage(
            this.isEditMode ? 'Curso atualizado com sucesso!' : 'Curso cadastrado com sucesso!',
            'success'
          );
          this.isSaving = false;
          this.router.navigate(['/cursos']);
        },
        error: (error) => {
          console.error('Erro ao salvar curso:', error);
          const apiMessage = extractApiMessage(error);
          this.showMessage(apiMessage || 'Erro ao salvar curso. Tente novamente.', 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.cursoForm);
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', 'warning');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (!this.validateFile(file)) {
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.setPreviewUrl(URL.createObjectURL(file));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!this.validateFile(file)) {
      return;
    }

    this.selectedFile = file;
    this.setPreviewUrl(URL.createObjectURL(file));
  }

  uploadCover(): void {
    if (!this.isEditMode || !this.cursoId || !this.selectedFile) {
      return;
    }

    this.isUploadingCover = true;
    this.uploadProgress = 0;

    this.cursosService.uploadCourseCover(this.cursoId, this.selectedFile).subscribe({
      next: (cursoAtualizado) => {
        this.showMessage('Foto de capa atualizada com sucesso!', 'success');
        this.selectedFile = null;
        this.isUploadingCover = false;
        this.uploadProgress = 100;
        this.fotoCapaPath = cursoAtualizado.fotoCapa || null;
        this.currentCoverUrl = this.fotoCapaPath ? this.buildImageUrl(this.fotoCapaPath) : null;
        this.setPreviewUrl(this.currentCoverUrl);
      },
      error: (error) => {
        console.error('❌ Erro ao enviar foto de capa:', error);
        const apiMessage = extractApiMessage(error);
        this.showMessage(apiMessage || 'Erro ao enviar foto de capa. Tente novamente.', 'error');
        this.isUploadingCover = false;
        this.uploadProgress = 0;
      }
    });
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.setPreviewUrl(this.currentCoverUrl);
  }

  async confirmDeleteCover(): Promise<void> {
    if (!this.isEditMode || !this.cursoId || !this.currentCoverUrl) {
      return;
    }

    const confirmed = await this.openConfirmDialog({
      title: 'Remover Foto de Capa',
      message: 'Tem certeza que deseja remover a foto de capa do curso? Esta ação não pode ser desfeita.',
      confirmText: 'Remover',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    this.isUploadingCover = true;
    this.cursosService.deleteCourseCover(this.cursoId).subscribe({
      next: () => {
        this.showMessage('Foto de capa removida com sucesso!', 'success');
        this.fotoCapaPath = null;
        this.currentCoverUrl = null;
        this.selectedFile = null;
        this.setPreviewUrl(null);
        this.isUploadingCover = false;
      },
      error: (error) => {
        const apiMessage = extractApiMessage(error);
        this.showMessage(apiMessage || 'Erro ao remover foto de capa. Tente novamente.', 'error');
        this.isUploadingCover = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/cursos']);
  }

  onReset(): void {
    this.cursoForm.reset({
      descricao: '',
      ativo: true,
      tipoId: null,
      unidadeAcademicaId: null
    });
    this.selectedFile = null;
    this.previewUrl = null;
    this.currentCoverUrl = this.fotoCapaPath ? this.buildImageUrl(this.fotoCapaPath) : null;
    this.setPreviewUrl(this.currentCoverUrl);
    this.selectedUnidadeAcademica = null;
    this.unidadeAcademicaSearchCtrl.setValue('', { emitEvent: false });
  }

  // Helpers
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';

    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // Getters para facilitar validação no template
  get nome() { return this.cursoForm.get('nome'); }
  get descricao() { return this.cursoForm.get('descricao'); }
  get ativo() { return this.cursoForm.get('ativo'); }
  get tipoId() { return this.cursoForm.get('tipoId'); }
  get unidadeAcademicaId() { return this.cursoForm.get('unidadeAcademicaId'); }

  private loadTiposCurso(): void {
    this.isLoadingTipos = true;
    this.tiposCursoService.getFirstPageAsList(100, undefined, 'nome', 'ASC').subscribe({
      next: (list: TipoCurso[]) => {
        this.tiposCurso = Array.isArray(list) ? list : [];
        this.isLoadingTipos = false;
      },
      error: () => {
        this.tiposCurso = [];
        this.isLoadingTipos = false;
      }
    });
  }

  private validateFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      this.showMessage('Formato inválido. Envie uma imagem JPEG, PNG, GIF ou WEBP.', 'warning');
      return false;
    }

    if (file.size > maxSize) {
      this.showMessage('Arquivo muito grande. Tamanho máximo permitido: 5MB.', 'warning');
      return false;
    }

    return true;
  }

  private setPreviewUrl(url: string | null): void {
    this.revokePreviewUrl();
    this.previewUrl = url;
  }

  private revokePreviewUrl(): void {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  private buildImageUrl(fotoCapa: string): string {
    if (!fotoCapa) {
      return '';
    }
    if (fotoCapa.startsWith('http')) {
      return fotoCapa;
    }
    const normalized = fotoCapa.startsWith('/') ? fotoCapa : `/${fotoCapa}`;
    return `${this.filesBaseUrl}${normalized}`;
  }

  private async openConfirmDialog(data: { title: string; message: string; confirmText: string; cancelText: string }): Promise<boolean> {
    const { SimpleConfirmDialogComponent } = await import('../../../../shared/components/simple-confirm-dialog/simple-confirm-dialog.component');
    const dialogRef = this.dialog.open(SimpleConfirmDialogComponent, {
      width: '420px',
      data
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  private setupUnidadeSearch(): void {
    this.unidadeSearchSub = this.unidadeAcademicaSearchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (typeof value === 'string') {
        const term = value.trim();
        this.searchUnidades(term);
        if (!term) {
          this.clearUnidadeSelection(false, false);
        }
      }
    });

    this.searchUnidades('');
  }

  private searchUnidades(term: string): void {
    this.isLoadingUnidades = true;
    this.unidadesAcademicasService.getFirstPageAsList(50, term || undefined, 'nome', 'ASC').subscribe({
      next: (list) => {
        this.unidadesAcademicas = Array.isArray(list) ? list : [];
        if (this.selectedUnidadeAcademica) {
          const alreadyExists = this.unidadesAcademicas.some(u => u.id === this.selectedUnidadeAcademica?.id);
          if (!alreadyExists) {
            this.unidadesAcademicas = [this.selectedUnidadeAcademica, ...this.unidadesAcademicas];
          }
        }
        this.isLoadingUnidades = false;
      },
      error: () => {
        this.unidadesAcademicas = [];
        this.isLoadingUnidades = false;
      }
    });
  }

  onUnidadeSelected(event: MatAutocompleteSelectedEvent): void {
    const unidade = event.option.value as UnidadeAcademica | null;
    if (!unidade) {
      this.clearUnidadeSelection();
      return;
    }
    this.setSelectedUnidade(unidade);
    this.unidadeAcademicaSearchCtrl.setValue(unidade.nome, { emitEvent: false });
  }

  clearUnidadeSelection(resetInput: boolean = true, markControl: boolean = true): void {
    this.selectedUnidadeAcademica = null;
    const control = this.unidadeAcademicaId;
    control?.setValue(null);
    if (markControl) {
      control?.markAsTouched();
      control?.markAsDirty();
    }
    control?.updateValueAndValidity();
    if (resetInput) {
      this.unidadeAcademicaSearchCtrl.setValue('', { emitEvent: false });
    }
  }

  private setSelectedUnidade(unidade: UnidadeAcademica): void {
    this.selectedUnidadeAcademica = unidade;
    const control = this.unidadeAcademicaId;
    control?.setValue(unidade.id);
    control?.markAsTouched();
    control?.markAsDirty();
    control?.updateValueAndValidity();
    this.unidadeAcademicaSearchCtrl.setValue(unidade.nome, { emitEvent: false });
  }

  private fetchUnidadeById(id: number): void {
    this.isLoadingUnidades = true;
    this.unidadesAcademicasService.getById(id).subscribe({
      next: (unidade) => {
        if (unidade) {
          this.setSelectedUnidade(unidade);
          const exists = this.unidadesAcademicas.some(u => u.id === unidade.id);
          if (!exists) {
            this.unidadesAcademicas = [unidade, ...this.unidadesAcademicas];
          }
        }
        this.isLoadingUnidades = false;
      },
      error: () => {
        this.isLoadingUnidades = false;
      }
    });
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Services
import { AtividadesService } from '../../services/atividades.service';
import { CursosService } from '../../../cursos/services/cursos.service';
import { FontesFinanciadorasService } from '../../../fontes-financiadoras/services/fontes-financiadoras.service';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { ImageCompressionService, CompressionResult } from '../../../../shared/services/image-compression.service';
import { AtividadeDTO, AtividadeUpdateDTO, AtividadeCreateDTO, PessoaPapelDTO } from '../../models/atividade.model';
import { Papel, PapeisDisponiveis, PapelUtils } from '../../models/papel.enum';
import { PageRequest } from '../../../../shared/models/page.model';

@Component({
  selector: 'acadmanage-form-atividade',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  templateUrl: './form-atividade.component.html',
  styleUrl: './form-atividade.component.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class FormAtividadeComponent implements OnInit {
  atividadeForm!: FormGroup;
  atividadeId!: number;
  cursoId!: number;
  cursoNome: string = '';
  isEditMode = false;
  atividade: AtividadeDTO | null = null;
  cursos: any[] = [];
  categorias: any[] = [];
  fontesFinanciadoras: any[] = [];
  fontesFinanciadorasSelecionadas: any[] = [];
  fonteFinanciadoraSelecionada: number | null = null;

  // Gerenciamento de Integrantes
  pessoas: any[] = [];
  integrantesSelecionados: PessoaPapelDTO[] = [];
  pessoaSelecionada: number | null = null;
  papelSelecionado: Papel = Papel.PARTICIPANTE;
  papeisDisponiveis = PapeisDisponiveis;
  coordenadorId: number | null = null;

  isLoading = true;
  isSaving = false;
  errorMessage = '';

  // Upload de imagem
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  dragOver = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private atividadesService: AtividadesService,
    private cursosService: CursosService,
    private fontesFinanciadorasService: FontesFinanciadorasService,
    private usuariosService: UsuariosService,
    private imageCompressionService: ImageCompressionService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.initForm();
    // Configurar locale pt-BR para o DatePicker
    this.dateAdapter.setLocale('pt-BR');
  }

  ngOnInit(): void {
    // Detectar modo: criar ou editar
    const id = this.route.snapshot.paramMap.get('id');
    const cursoIdParam = this.route.snapshot.paramMap.get('cursoId');

    if (id) {
      // Modo EDIÇÃO
      this.isEditMode = true;
      this.atividadeId = Number(id);
      console.log('✏️ Modo EDIÇÃO - Atividade ID:', this.atividadeId);
    } else if (cursoIdParam) {
      // Modo CRIAÇÃO
      this.isEditMode = false;
      this.cursoId = Number(cursoIdParam);
      console.log('➕ Modo CRIAÇÃO - Curso ID:', this.cursoId);
    }

    // Tentar recuperar dados do state (enviado pela navegação)
    const state = history.state;
    if (state && state.atividade) {
      this.atividade = state.atividade;
      this.populateForm();
    }

    // Recuperar informações do curso para modo criação
    if (!this.isEditMode) {
      if (state && state.cursoNome) {
        this.cursoNome = state.cursoNome;
        console.log('📚 Nome do curso (do state):', this.cursoNome);
      }
    }

    this.loadData();

    // Log para debug
    console.log('🔍 FormAtividadeComponent inicializado:');
    console.log('🔍 Modo:', this.isEditMode ? 'EDIÇÃO' : 'CRIAÇÃO');
    console.log('🔍 Atividade ID:', this.atividadeId);
    console.log('🔍 Curso ID:', this.cursoId);
    console.log('🔍 Atividade do state:', this.atividade);
  }

  initForm(): void {
    this.atividadeForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      objetivo: [''],
      publicoAlvo: [''],
      statusPublicacao: [false],
      coordenador: [''],
      dataRealizacao: ['', Validators.required],
      cursoId: [{ value: '', disabled: true }], // Desabilitado - curso não pode ser alterado
      categoriaId: ['', Validators.required]
    });
  }

  loadData(): void {
    this.isLoading = true;

    // Carregar dados em paralelo
    const promises = [
      this.loadCursos(),
      this.loadCategorias(),
      this.loadFontesFinanciadoras(),
      this.loadPessoas()
    ];

    // Apenas carregar atividade se estiver em modo edição
    if (this.isEditMode) {
      promises.push(this.loadAtividade());
    }

    Promise.all(promises).finally(() => {
      this.isLoading = false;
    });
  }

  loadCursos(): Promise<void> {
    return new Promise((resolve) => {
      // Buscar todos os cursos sem paginação (para dropdown)
      const pageRequest: PageRequest = {
        page: 0,
        size: 1000, // Buscar muitos cursos para ter todos disponíveis
        sortBy: 'nome',
        direction: 'ASC' as 'ASC'
      };

      this.cursosService.getAllCoursesPaginado(pageRequest).subscribe({
        next: (page: any) => {
          this.cursos = page.content || [];
          console.log('📚 Cursos carregados:', this.cursos.length);

          // Se estiver em modo criação e não tiver nome do curso, buscar
          if (!this.isEditMode && !this.cursoNome && this.cursoId) {
            const curso = this.cursos.find(c => c.id === this.cursoId);
            if (curso) {
              this.cursoNome = curso.nome;
              console.log('📚 Nome do curso encontrado:', this.cursoNome);
            }
          }

          resolve();
        },
        error: (error: any) => {
          console.error('❌ Erro ao carregar cursos:', error);
          this.cursos = [];
          resolve();
        }
      });
    });
  }

  loadCategorias(): Promise<void> {
    return new Promise((resolve) => {
      this.cursosService.getAllCategoriesPaginado({ page: 0, size: 1000, sortBy: 'id', direction: 'ASC' }).subscribe({
        next: (page: any) => {
          this.categorias = Array.isArray(page) ? page : (page?.content || []);
          console.log('📂 Categorias carregadas:', this.categorias);
          resolve();
        },
        error: (error: any) => {
          console.error('❌ Erro ao carregar categorias:', error);
          this.categorias = [];
          resolve();
        }
      });
    });
  }

  loadFontesFinanciadoras(): Promise<void> {
    return new Promise((resolve) => {
      this.fontesFinanciadorasService.listarTodas().subscribe({
        next: (fontes: any[]) => {
          this.fontesFinanciadoras = fontes || [];
          console.log('💰 Fontes financiadoras carregadas:', this.fontesFinanciadoras);
          resolve();
        },
        error: (error: any) => {
          console.error('❌ Erro ao carregar fontes financiadoras:', error);
          this.fontesFinanciadoras = [];
          resolve();
        }
      });
    });
  }

  loadPessoas(): Promise<void> {
    return new Promise((resolve) => {
      this.usuariosService.getAllUsersPaginado({ page: 0, size: 1000, sortBy: 'id', direction: 'ASC' }).subscribe({
        next: (page: any) => {
          this.pessoas = Array.isArray(page) ? page : (page?.content || []);
          console.log('👥 Pessoas carregadas:', this.pessoas);
          resolve();
        },
        error: (error: any) => {
          console.error('❌ Erro ao carregar pessoas:', error);
          this.pessoas = [];
          resolve();
        }
      });
    });
  }

  loadAtividade(): Promise<void> {
    return new Promise((resolve) => {
      if (this.atividade) {
        // Dados já carregados via state
        resolve();
        return;
      }

      this.atividadesService.getAtividadeById(this.atividadeId).subscribe({
        next: (atividade) => {
          this.atividade = atividade;
          this.populateForm();
          console.log('✅ Atividade carregada:', atividade);
          resolve();
        },
        error: (error) => {
          console.error('❌ Erro ao carregar atividade:', error);
          this.errorMessage = 'Erro ao carregar dados da atividade';
          resolve();
        }
      });
    });
  }

  populateForm(): void {
    if (!this.atividade) return;

    this.atividadeForm.patchValue({
      nome: this.atividade.nome,
      objetivo: this.atividade.objetivo,
      publicoAlvo: this.atividade.publicoAlvo,
      statusPublicacao: this.atividade.statusPublicacao,
      coordenador: this.atividade.coordenador,
      dataRealizacao: this.atividade.dataRealizacao,
      cursoId: this.atividade.curso.id,
      categoriaId: this.atividade.categoria.id
    });

    // Configurar preview da imagem atual
    if (this.atividade.fotoCapa) {
      this.previewUrl = this.getImageUrl(this.atividade.fotoCapa);
    }

    // Carregar fontes financiadoras da atividade
    if (this.atividade.fontesFinanciadora && this.atividade.fontesFinanciadora.length > 0) {
      this.fontesFinanciadorasSelecionadas = [...this.atividade.fontesFinanciadora];
      console.log('💰 Fontes financiadoras da atividade carregadas:', this.fontesFinanciadorasSelecionadas);
    }

    // Carregar integrantes da atividade
    if (this.atividade.integrantes && this.atividade.integrantes.length > 0) {
      this.integrantesSelecionados = [...this.atividade.integrantes];
      console.log('👥 Integrantes da atividade carregados:', this.integrantesSelecionados);

      // Identificar o coordenador
      const coordenador = this.integrantesSelecionados.find(i => i.papel === Papel.COORDENADOR);
      if (coordenador) {
        this.coordenadorId = coordenador.id;
        console.log('👤 Coordenador identificado:', coordenador);
      }
    }

    console.log('📝 Formulário preenchido com dados da atividade');
  }

  // Métodos para upload de imagem
  async onFileSelected(event: any): Promise<void> {
    event.preventDefault(); // Prevenir comportamento padrão
    event.stopPropagation(); // Evitar propagação do evento

    const file = event.target.files[0];
    if (file) {
      console.log('📸 Arquivo selecionado via input:', file.name);
      await this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      await this.handleFile(files[0]);
    }
  }

  private async handleFile(file: File): Promise<void> {
    // Validar arquivo usando o serviço
    const validation = this.imageCompressionService.validateImageFile(file);
    if (!validation.isValid) {
      this.showMessage(validation.error!, 'error');
      return;
    }

    console.log('📸 Arquivo selecionado:', {
      nome: file.name,
      tamanho: this.imageCompressionService.formatFileSize(file.size),
      tipo: file.type
    });

    try {
      // Mostrar mensagem de compressão
      this.showMessage('Comprimindo imagem...', 'warning');

      // Comprimir imagem
      const compressionResult: CompressionResult = await this.imageCompressionService.compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        maxSizeKB: 500 // 500KB máximo
      });

      this.selectedFile = compressionResult.compressedFile;

      // Criar preview da imagem comprimida
      this.previewUrl = await this.imageCompressionService.createPreview(compressionResult.compressedFile);

      // Mostrar resultado da compressão
      this.showMessage(
        `Imagem comprimida: ${this.imageCompressionService.formatFileSize(compressionResult.compressedSize)} (${compressionResult.compressionRatio.toFixed(1)}% menor)`,
        'success'
      );

      console.log('✅ Compressão concluída:', {
        tamanhoOriginal: this.imageCompressionService.formatFileSize(compressionResult.originalSize),
        tamanhoComprimido: this.imageCompressionService.formatFileSize(compressionResult.compressedSize),
        taxaCompressao: `${compressionResult.compressionRatio.toFixed(1)}%`
      });

    } catch (error) {
      console.error('❌ Erro na compressão:', error);
      this.showMessage('Erro ao processar a imagem. Tente novamente.', 'error');
    }
  }

  uploadImage(): void {
    if (!this.selectedFile || !this.atividadeId) {
      this.showMessage('Nenhum arquivo selecionado', 'error');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    console.log('📤 Iniciando upload da imagem...');

    this.atividadesService.uploadFotoCapa(this.atividadeId, this.selectedFile).subscribe({
      next: (response) => {
        console.log('✅ Upload realizado com sucesso:', response);
        this.uploadProgress = 100;
        this.showMessage('Foto de capa atualizada com sucesso!', 'success');

        // Atualizar preview com a nova URL
        if (response.fotoCapa) {
          this.previewUrl = this.getImageUrl(response.fotoCapa);
        }

        // Limpar arquivo selecionado
        this.selectedFile = null;
        this.isUploading = false;
      },
      error: (error) => {
        console.error('❌ Erro no upload:', error);
        this.showMessage('Erro ao fazer upload da imagem: ' + this.extractErrorMessage(error), 'error');
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = this.atividade?.fotoCapa ? this.getImageUrl(this.atividade.fotoCapa) : null;
  }

  getImageUrl(fotoCapa: string): string {
    if (fotoCapa.startsWith('http')) {
      return fotoCapa;
    }
    return `http://localhost:8080/api/files${fotoCapa}`;
  }

  // Métodos para gerenciar fontes financiadoras
  adicionarFonteFinanciadora(): void {
    console.log('🔄 Tentando adicionar fonte. ID selecionado:', this.fonteFinanciadoraSelecionada);
    console.log('📋 Fontes selecionadas ANTES:', [...this.fontesFinanciadorasSelecionadas]);

    if (!this.fonteFinanciadoraSelecionada) {
      this.showMessage('Selecione uma fonte financiadora', 'warning');
      return;
    }

    // Verificar se já foi adicionada
    const jaAdicionada = this.fontesFinanciadorasSelecionadas.some(
      f => f.id === this.fonteFinanciadoraSelecionada
    );

    if (jaAdicionada) {
      this.showMessage('Esta fonte financiadora já foi adicionada', 'warning');
      console.log('⚠️ Fonte já adicionada!');
      return;
    }

    // Encontrar a fonte selecionada na lista completa
    const fonte = this.fontesFinanciadoras.find(
      f => f.id === this.fonteFinanciadoraSelecionada
    );

    console.log('🔍 Fonte encontrada na lista completa:', fonte);

    if (fonte) {
      this.fontesFinanciadorasSelecionadas.push(fonte);
      this.fonteFinanciadoraSelecionada = null; // Limpar seleção
      console.log('✅ Fonte financiadora adicionada à lista:', fonte);
      console.log('📋 Fontes selecionadas DEPOIS:', [...this.fontesFinanciadorasSelecionadas]);
      console.log('📊 Total de fontes:', this.fontesFinanciadorasSelecionadas.length);
      // Mensagem removida - só mostra ao salvar efetivamente
    } else {
      console.error('❌ Fonte não encontrada na lista completa!');
      this.showMessage('Erro ao adicionar fonte à lista', 'error');
    }
  }

  removerFonteFinanciadora(fonte: any): void {
    console.log('🗑️ Tentando remover fonte:', fonte);
    console.log('📋 Fontes selecionadas ANTES da remoção:', [...this.fontesFinanciadorasSelecionadas]);

    const index = this.fontesFinanciadorasSelecionadas.findIndex(f => f.id === fonte.id);
    console.log('📍 Índice encontrado:', index);

    if (index > -1) {
      this.fontesFinanciadorasSelecionadas.splice(index, 1);
      console.log('❌ Fonte financiadora removida da lista:', fonte);
      console.log('📋 Fontes restantes:', [...this.fontesFinanciadorasSelecionadas]);
      console.log('📊 Total de fontes:', this.fontesFinanciadorasSelecionadas.length);
      // Mensagem removida - só mostra ao salvar efetivamente
    } else {
      console.error('❌ Fonte não encontrada para remoção!');
    }
  }

  getFontesFinanciadorasDisponiveis(): any[] {
    // Retornar apenas fontes que ainda não foram selecionadas
    return this.fontesFinanciadoras.filter(
      fonte => !this.fontesFinanciadorasSelecionadas.some(
        selecionada => selecionada.id === fonte.id
      )
    );
  }

  // Métodos para gerenciar integrantes
  onCoordenadorChange(pessoaId: number): void {
    console.log('👤 Coordenador alterado para pessoa ID:', pessoaId);

    if (!pessoaId) return;

    // Encontrar a pessoa selecionada
    const pessoa = this.pessoas.find(p => p.id === pessoaId);
    if (!pessoa) {
      console.error('❌ Pessoa não encontrada!');
      return;
    }

    // Remover coordenador anterior (se existir)
    const coordenadorAnteriorIndex = this.integrantesSelecionados.findIndex(i => i.papel === Papel.COORDENADOR);
    if (coordenadorAnteriorIndex > -1) {
      const coordenadorAnterior = this.integrantesSelecionados[coordenadorAnteriorIndex];
      console.log('🔄 Removendo coordenador anterior:', coordenadorAnterior.nome);
      this.integrantesSelecionados.splice(coordenadorAnteriorIndex, 1);
    }

    // Verificar se a pessoa já está nos integrantes com outro papel
    const integranteExistenteIndex = this.integrantesSelecionados.findIndex(i => i.id === pessoaId);
    if (integranteExistenteIndex > -1) {
      // Atualizar papel para COORDENADOR
      console.log('🔄 Pessoa já era integrante, atualizando para COORDENADOR');
      this.integrantesSelecionados[integranteExistenteIndex].papel = Papel.COORDENADOR;
    } else {
      // Adicionar como novo integrante
      const novoCoordenador: PessoaPapelDTO = {
        id: pessoa.id,
        nome: pessoa.nome || pessoa.name,
        cpf: pessoa.cpf,
        papel: Papel.COORDENADOR
      };
      this.integrantesSelecionados.unshift(novoCoordenador); // Adiciona no início
      console.log('✅ Coordenador adicionado aos integrantes:', novoCoordenador);
    }

    // Atualizar campo coordenador no formulário
    this.atividadeForm.patchValue({
      coordenador: pessoa.nome || pessoa.name
    });

    console.log('📋 Integrantes após mudança de coordenador:', this.integrantesSelecionados);
  }

  adicionarIntegrante(): void {
    console.log('🔄 Tentando adicionar integrante. Pessoa ID:', this.pessoaSelecionada, 'Papel:', this.papelSelecionado);
    console.log('📋 Integrantes selecionados ANTES:', [...this.integrantesSelecionados]);

    if (!this.pessoaSelecionada) {
      this.showMessage('Selecione uma pessoa', 'warning');
      return;
    }

    // Não permitir adicionar COORDENADOR manualmente (deve usar o campo específico)
    if (this.papelSelecionado === Papel.COORDENADOR) {
      this.showMessage('Para definir o coordenador, use o campo "Coordenador" acima', 'warning');
      console.log('⚠️ Tentativa de adicionar coordenador manualmente');
      return;
    }

    // Verificar se já foi adicionada
    const jaAdicionada = this.integrantesSelecionados.some(
      i => i.id === this.pessoaSelecionada
    );

    if (jaAdicionada) {
      this.showMessage('Esta pessoa já foi adicionada', 'warning');
      console.log('⚠️ Pessoa já adicionada!');
      return;
    }

    // Encontrar a pessoa selecionada na lista completa
    const pessoa = this.pessoas.find(
      p => p.id === this.pessoaSelecionada
    );

    console.log('🔍 Pessoa encontrada na lista completa:', pessoa);

    if (pessoa) {
      // Criar objeto PessoaPapelDTO
      const integrante: PessoaPapelDTO = {
        id: pessoa.id,
        nome: pessoa.nome || pessoa.name,
        cpf: pessoa.cpf,
        papel: this.papelSelecionado
      };

      this.integrantesSelecionados.push(integrante);
      this.pessoaSelecionada = null; // Limpar seleção
      this.papelSelecionado = Papel.PARTICIPANTE; // Resetar para padrão

      console.log('✅ Integrante adicionado à lista:', integrante);
      console.log('📋 Integrantes selecionados DEPOIS:', [...this.integrantesSelecionados]);
      console.log('📊 Total de integrantes:', this.integrantesSelecionados.length);
      // Sem mensagem - só mostra ao salvar
    } else {
      console.error('❌ Pessoa não encontrada na lista completa!');
      this.showMessage('Erro ao adicionar integrante à lista', 'error');
    }
  }

  removerIntegrante(integrante: PessoaPapelDTO): void {
    console.log('🗑️ Tentando remover integrante:', integrante);
    console.log('📋 Integrantes selecionados ANTES da remoção:', [...this.integrantesSelecionados]);

    // Não permitir remover o coordenador (deve trocar no campo específico)
    if (integrante.papel === Papel.COORDENADOR) {
      this.showMessage('O coordenador não pode ser removido. Para trocar, selecione outro no campo "Coordenador"', 'warning');
      console.log('⚠️ Tentativa de remover coordenador bloqueada');
      return;
    }

    const index = this.integrantesSelecionados.findIndex(i => i.id === integrante.id);
    console.log('📍 Índice encontrado:', index);

    if (index > -1) {
      this.integrantesSelecionados.splice(index, 1);
      console.log('❌ Integrante removido da lista:', integrante);
      console.log('📋 Integrantes restantes:', [...this.integrantesSelecionados]);
      console.log('📊 Total de integrantes:', this.integrantesSelecionados.length);
      // Sem mensagem - só mostra ao salvar
    } else {
      console.error('❌ Integrante não encontrado para remoção!');
    }
  }

  alterarPapelIntegrante(integrante: PessoaPapelDTO, novoPapel: Papel): void {
    console.log('🔄 Alterando papel de:', integrante.nome, 'para:', novoPapel);

    // Não permitir alterar para COORDENADOR (deve usar o campo específico)
    if (novoPapel === Papel.COORDENADOR) {
      this.showMessage('Para definir como coordenador, use o campo "Coordenador" acima', 'warning');
      console.log('⚠️ Tentativa de alterar para coordenador bloqueada');
      return;
    }

    // Não permitir alterar o papel do coordenador atual
    if (integrante.papel === Papel.COORDENADOR) {
      this.showMessage('O coordenador não pode ter seu papel alterado. Selecione outro coordenador primeiro', 'warning');
      console.log('⚠️ Tentativa de alterar papel do coordenador bloqueada');
      return;
    }

    const index = this.integrantesSelecionados.findIndex(i => i.id === integrante.id);

    if (index > -1) {
      this.integrantesSelecionados[index].papel = novoPapel;
      console.log('✅ Papel alterado:', this.integrantesSelecionados[index]);
      // Sem mensagem - só mostra ao salvar
    }
  }

  getPessoasDisponiveis(): any[] {
    // Retornar apenas pessoas que ainda não foram selecionadas
    return this.pessoas.filter(
      pessoa => !this.integrantesSelecionados.some(
        selecionado => selecionado.id === pessoa.id
      )
    );
  }

  getPapelLabel(papel: string): string {
    return PapelUtils.getLabel(papel as Papel);
  }

  getPapelIcon(papel: string): string {
    return PapelUtils.getIcon(papel as Papel);
  }

  getPapelColor(papel: string): string {
    return PapelUtils.getColor(papel as Papel);
  }

  private validateAtividadeData(data: any): void {
    console.log('🔍 Validando dados da atividade:');

    // Verificar campos obrigatórios básicos
    const requiredFields = ['nome', 'objetivo', 'publicoAlvo', 'coordenador', 'dataRealizacao'];
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
      const value = (data as any)[field];
      if (value === null || value === undefined || value === '') {
        missingFields.push(field);
      }
    });

    // Verificar curso (pode ser cursoId ou curso.id)
    const cursoId = data.cursoId || data.curso?.id;
    if (!cursoId || cursoId === 0) {
      missingFields.push('curso');
    }

    // Verificar categoria (pode ser categoriaId ou categoria.id)
    const categoriaId = data.categoriaId || data.categoria?.id;
    if (!categoriaId || categoriaId === 0) {
      missingFields.push('categoria');
    }

    if (missingFields.length > 0) {
      console.warn('⚠️ Campos com valores ausentes:', missingFields);
      // Não bloquear o envio, apenas avisar
    } else {
      console.log('✅ Todos os campos obrigatórios preenchidos');
    }

    // Verificar tipos de dados (apenas warnings)
    if (data.nome && typeof data.nome !== 'string') {
      console.warn('⚠️ Nome deve ser string:', typeof data.nome);
    }
    if (data.statusPublicacao !== undefined && typeof data.statusPublicacao !== 'boolean') {
      console.warn('⚠️ StatusPublicacao deve ser boolean:', typeof data.statusPublicacao);
    }

    // Verificar formato da data
    if (data.dataRealizacao && !this.isValidDate(data.dataRealizacao)) {
      console.warn('⚠️ Data pode estar em formato inválido:', data.dataRealizacao);
    }

    console.log('✅ Validação concluída');
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  onSubmit(): void {
    if (this.atividadeForm.valid) {
      this.isSaving = true;

      const formData = this.atividadeForm.value;
      console.log('📝 Dados do formulário:', formData);
      console.log('🔍 Modo:', this.isEditMode ? 'EDIÇÃO' : 'CRIAÇÃO');

      if (this.isEditMode) {
        this.updateAtividade(formData);
      } else {
        this.createNovaAtividade(formData);
      }
    } else {
      this.markFormGroupTouched();
      this.showMessage('Por favor, preencha todos os campos obrigatórios', 'warning');
    }
  }

  private updateAtividade(formData: any): void {

      // Converter data para formato ISO se necessário
      let dataRealizacao = formData.dataRealizacao;
      if (dataRealizacao instanceof Date) {
        dataRealizacao = dataRealizacao.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      // Tentar diferentes formatos de dados
      let atividadeUpdate: any;

      // Extrair IDs das fontes financiadoras selecionadas
      const fontesFinanciadoraIds = this.fontesFinanciadorasSelecionadas.map(f => f.id);
      console.log('💰 Fontes Selecionadas (Array Completo):', this.fontesFinanciadorasSelecionadas);
      console.log('💰 IDs das fontes financiadoras:', fontesFinanciadoraIds);
      console.log('💰 Quantidade de fontes selecionadas:', this.fontesFinanciadorasSelecionadas.length);

      // Formatar fontes financiadoras no padrão esperado pelo backend
      const fontesFinanciadoraFormatadas = this.fontesFinanciadorasSelecionadas.map(fonte => ({
        id: fonte.id,
        nome: fonte.nome
      }));
      console.log('💰 Fontes Formatadas:', fontesFinanciadoraFormatadas);

      // Formatar integrantes no padrão esperado pelo backend
      const integrantesFormatados = this.integrantesSelecionados.map(integrante => ({
        id: integrante.id,
        nome: integrante.nome,
        cpf: integrante.cpf,
        papel: integrante.papel
      }));
      console.log('👥 Integrantes Formatados:', integrantesFormatados);
      console.log('👥 Quantidade de integrantes:', this.integrantesSelecionados.length);
      console.log('👥 Integrantes Selecionados (raw):', JSON.stringify(this.integrantesSelecionados, null, 2));

      if (this.atividade) {
        // Buscar categoria selecionada
        const categoriaSelecionada = this.categorias.find(c => c.id === formData.categoriaId);

        console.log('📚 Curso da atividade (fixo):', this.atividade.curso);
        console.log('📂 Categoria selecionada (ID: ' + formData.categoriaId + '):', categoriaSelecionada);

        // Formato completo com dados existentes
        atividadeUpdate = {
          id: this.atividade.id,
          nome: formData.nome || '',
          objetivo: formData.objetivo || '',
          publicoAlvo: formData.publicoAlvo || '',
          statusPublicacao: formData.statusPublicacao !== null ? formData.statusPublicacao : false,
          coordenador: formData.coordenador || '',
          dataRealizacao: dataRealizacao || '',
          fotoCapa: this.atividade.fotoCapa || '',
          curso: {
            id: this.atividade.curso.id,
            nome: this.atividade.curso.nome,
            ativo: this.atividade.curso.ativo
          },
          categoria: {
            id: formData.categoriaId || 0,
            nome: categoriaSelecionada?.nome || this.atividade.categoria.nome
          },
          fontesFinanciadora: fontesFinanciadoraFormatadas,
          integrantes: integrantesFormatados
        };
      } else {
        // Formato simples para AtividadeUpdateDTO
        atividadeUpdate = {
          nome: formData.nome || '',
          objetivo: formData.objetivo || '',
          publicoAlvo: formData.publicoAlvo || '',
          statusPublicacao: formData.statusPublicacao !== null ? formData.statusPublicacao : false,
          coordenador: formData.coordenador || '',
          dataRealizacao: dataRealizacao || '',
          cursoId: formData.cursoId || 0,
          categoriaId: formData.categoriaId || 0,
          fontesFinanciadoraIds: fontesFinanciadoraIds
        };
      }

      console.log('💾 Salvando atividade:', atividadeUpdate);
      console.log('💾 Tipo de dataRealizacao:', typeof atividadeUpdate.dataRealizacao);
      console.log('💾 Valor de dataRealizacao:', atividadeUpdate.dataRealizacao);
      console.log('💰 Fontes Financiadoras Formatadas:', fontesFinanciadoraFormatadas);
      console.log('📋 JSON que será enviado:', JSON.stringify(atividadeUpdate, null, 2));

      // Validação adicional dos dados antes do envio
      this.validateAtividadeData(atividadeUpdate);

      this.atividadesService.updateAtividade(this.atividadeId, atividadeUpdate).subscribe({
        next: (response) => {
          console.log('✅ Atividade atualizada com sucesso:', response);
          this.showMessage('Atividade atualizada com sucesso!', 'success');
          this.isSaving = false;

          // Atualizar dados da atividade com a resposta
          this.atividade = response;

          // Atualizar formulário com dados retornados
          console.log('🔄 Atualizando formulário com dados da API...');
          this.populateForm();

          console.log('✅ Formulário atualizado com sucesso');
          console.log('👥 Integrantes após atualização:', this.integrantesSelecionados.length);
          console.log('💰 Fontes após atualização:', this.fontesFinanciadorasSelecionadas.length);

          // NÃO navegar de volta automaticamente - permitir upload de imagem
          // this.goBack();
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar atividade:', error);
          console.error('❌ Status:', error?.status);
          console.error('❌ Error Body:', error?.error);
          this.showMessage('Erro ao atualizar atividade: ' + this.extractErrorMessage(error), 'error');
          this.isSaving = false;
        }
      });
  }

  markFormGroupTouched(): void {
    Object.keys(this.atividadeForm.controls).forEach(key => {
      const control = this.atividadeForm.get(key);
      control?.markAsTouched();
    });
  }

  private createNovaAtividade(formData: any): void {
    // Converter data para formato ISO
    let dataRealizacao = formData.dataRealizacao;
    if (dataRealizacao instanceof Date) {
      dataRealizacao = dataRealizacao.toISOString().split('T')[0];
    }

    // Buscar curso completo
    const curso = this.cursos.find(c => c.id === this.cursoId);
    if (!curso) {
      console.error('❌ Curso não encontrado:', this.cursoId);
      this.showMessage('Erro: Curso não encontrado', 'error');
      this.isSaving = false;
      return;
    }

    // Buscar categoria completa
    const categoria = this.categorias.find(c => c.id === formData.categoriaId);
    if (!categoria) {
      console.error('❌ Categoria não encontrada:', formData.categoriaId);
      this.showMessage('Erro: Categoria não encontrada', 'error');
      this.isSaving = false;
      return;
    }

    // Formatar fontes financiadoras
    const fontesFinanciadoraFormatadas = this.fontesFinanciadorasSelecionadas.map(fonte => ({
      id: fonte.id,
      nome: fonte.nome
    }));

    // Formatar integrantes
    const integrantesFormatados = this.integrantesSelecionados.map(integrante => ({
      id: integrante.id,
      nome: integrante.nome,
      cpf: integrante.cpf,
      papel: integrante.papel
    }));

    console.log('💰 Fontes Formatadas:', fontesFinanciadoraFormatadas);
    console.log('👥 Integrantes Formatados:', integrantesFormatados);

    // Criar objeto AtividadeDTO completo
    const novaAtividade: AtividadeDTO = {
      nome: formData.nome || '',
      objetivo: formData.objetivo || '',
      publicoAlvo: formData.publicoAlvo || '',
      statusPublicacao: formData.statusPublicacao !== null ? formData.statusPublicacao : false,
      coordenador: formData.coordenador || '',
      dataRealizacao: dataRealizacao || '',
      curso: {
        id: curso.id,
        nome: curso.nome,
        descricao: curso.descricao || '',
        ativo: curso.ativo !== undefined ? curso.ativo : true
      },
      categoria: {
        id: categoria.id,
        nome: categoria.nome,
        descricao: categoria.descricao || ''
      },
      fontesFinanciadora: fontesFinanciadoraFormatadas,
      integrantes: integrantesFormatados
    };

    console.log('➕ Criando nova atividade:', novaAtividade);
    console.log('📋 JSON que será enviado:', JSON.stringify(novaAtividade, null, 2));

    this.atividadesService.createAtividade(novaAtividade).subscribe({
      next: (response) => {
        console.log('✅ Atividade criada com sucesso:', response);

        // Se houver imagem selecionada, fazer upload
        if (this.selectedFile && response.id) {
          console.log('📤 Fazendo upload da foto de capa...');
          this.atividadesService.uploadFotoCapa(response.id, this.selectedFile).subscribe({
            next: (uploadResponse) => {
              console.log('✅ Foto de capa enviada com sucesso:', uploadResponse);
              this.showMessage('Atividade criada e foto de capa salva com sucesso!', 'success');
              this.isSaving = false;

              // Redirecionar para a lista de atividades do curso
              this.router.navigate(['/atividades/curso', this.cursoId]);
            },
            error: (uploadError) => {
              console.error('❌ Erro ao fazer upload da foto:', uploadError);
              this.showMessage('Atividade criada, mas erro ao salvar foto de capa: ' + this.extractErrorMessage(uploadError), 'warning');
              this.isSaving = false;

              // Redirecionar mesmo com erro no upload
              this.router.navigate(['/atividades/curso', this.cursoId]);
            }
          });
        } else {
          // Sem imagem, apenas redirecionar
          this.showMessage('Atividade criada com sucesso!', 'success');
          this.isSaving = false;
          this.router.navigate(['/atividades/curso', this.cursoId]);
        }
      },
      error: (error) => {
        console.error('❌ Erro ao criar atividade:', error);
        console.error('❌ Status:', error?.status);
        console.error('❌ Error Body:', error?.error);
        this.showMessage('Erro ao criar atividade: ' + this.extractErrorMessage(error), 'error');
        this.isSaving = false;
      }
    });
  }

  saveAndGoBack(): void {
    if (this.atividadeForm.valid) {
      this.isSaving = true;

      const formData = this.atividadeForm.value;
      console.log('📝 Salvando e voltando...');

      // Converter data para formato ISO se necessário
      let dataRealizacao = formData.dataRealizacao;
      if (dataRealizacao instanceof Date) {
        dataRealizacao = dataRealizacao.toISOString().split('T')[0];
      }

      // Extrair IDs das fontes financiadoras selecionadas
      const fontesFinanciadoraIds = this.fontesFinanciadorasSelecionadas.map(f => f.id);
      console.log('💰 Fontes Selecionadas (saveAndGoBack):', this.fontesFinanciadorasSelecionadas);
      console.log('💰 IDs das fontes (saveAndGoBack):', fontesFinanciadoraIds);
      console.log('💰 Quantidade de fontes (saveAndGoBack):', this.fontesFinanciadorasSelecionadas.length);

      // Formatar fontes financiadoras no padrão esperado pelo backend
      const fontesFinanciadoraFormatadas = this.fontesFinanciadorasSelecionadas.map(fonte => ({
        id: fonte.id,
        nome: fonte.nome
      }));
      console.log('💰 Fontes Formatadas (saveAndGoBack):', fontesFinanciadoraFormatadas);

      // Formatar integrantes no padrão esperado pelo backend
      const integrantesFormatados = this.integrantesSelecionados.map(integrante => ({
        id: integrante.id,
        nome: integrante.nome,
        cpf: integrante.cpf,
        papel: integrante.papel
      }));
      console.log('👥 Integrantes Formatados (saveAndGoBack):', integrantesFormatados);

      // Usar dados existentes da atividade
      let atividadeUpdate: any;

      if (this.atividade) {
        // Buscar categoria selecionada
        const categoriaSelecionada = this.categorias.find(c => c.id === formData.categoriaId);

        atividadeUpdate = {
          id: this.atividade.id,
          nome: formData.nome || '',
          objetivo: formData.objetivo || '',
          publicoAlvo: formData.publicoAlvo || '',
          statusPublicacao: formData.statusPublicacao !== null ? formData.statusPublicacao : false,
          coordenador: formData.coordenador || '',
          dataRealizacao: dataRealizacao || '',
          fotoCapa: this.atividade.fotoCapa || '',
          curso: {
            id: this.atividade.curso.id,
            nome: this.atividade.curso.nome,
            ativo: this.atividade.curso.ativo
          },
          categoria: {
            id: formData.categoriaId || 0,
            nome: categoriaSelecionada?.nome || this.atividade.categoria.nome
          },
          fontesFinanciadora: fontesFinanciadoraFormatadas,  // ✅ CORRIGIDO: Usar fontes formatadas
          integrantes: integrantesFormatados
        };
      } else {
        atividadeUpdate = {
          nome: formData.nome || '',
          objetivo: formData.objetivo || '',
          publicoAlvo: formData.publicoAlvo || '',
          statusPublicacao: formData.statusPublicacao !== null ? formData.statusPublicacao : false,
          coordenador: formData.coordenador || '',
          dataRealizacao: dataRealizacao || '',
          cursoId: formData.cursoId || 0,
          categoriaId: formData.categoriaId || 0,
          fontesFinanciadoraIds: fontesFinanciadoraIds
        };
      }

      console.log('📋 JSON que será enviado (saveAndGoBack):', JSON.stringify(atividadeUpdate, null, 2));

      this.atividadesService.updateAtividade(this.atividadeId, atividadeUpdate).subscribe({
        next: (response) => {
          console.log('✅ Atividade salva, voltando para lista');
          this.showMessage('Atividade atualizada com sucesso!', 'success');
          this.isSaving = false;
          this.goBack();
        },
        error: (error) => {
          console.error('❌ Erro ao salvar:', error);
          this.showMessage('Erro ao atualizar atividade: ' + this.extractErrorMessage(error), 'error');
          this.isSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.showMessage('Por favor, preencha todos os campos obrigatórios', 'warning');
    }
  }

  goBack(): void {
    const state = history.state;
    if (state && state.cursoId) {
      this.router.navigate(['/atividades/curso', state.cursoId], {
        state: { cursoNome: state.cursoNome }
      });
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  private extractErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Erro desconhecido';
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const panelClass = type === 'success' ? 'snackbar-success' :
                      type === 'error' ? 'snackbar-error' :
                      'snackbar-warning';

    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  // Getters para facilitar acesso no template
  get nome() { return this.atividadeForm.get('nome'); }
  get objetivo() { return this.atividadeForm.get('objetivo'); }
  get publicoAlvo() { return this.atividadeForm.get('publicoAlvo'); }
  get statusPublicacao() { return this.atividadeForm.get('statusPublicacao'); }
  get coordenador() { return this.atividadeForm.get('coordenador'); }
  get dataRealizacao() { return this.atividadeForm.get('dataRealizacao'); }
  get categoriaId() { return this.atividadeForm.get('categoriaId'); }
}

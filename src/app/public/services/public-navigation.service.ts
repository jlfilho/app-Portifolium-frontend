import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicNavigationService {

  constructor(private router: Router) {}

  /**
   * Navega para a lista de cursos públicos
   */
  navigateToCursosPublicos(): void {
    this.router.navigate(['/cursos-publicos']);
  }

  /**
   * Navega para as atividades públicas de um curso
   */
  navigateToAtividadesPublicas(cursoId: number, cursoNome?: string): void {
    this.router.navigate(['/atividades-publicas/curso', cursoId], {
      state: { cursoNome }
    });
  }

  /**
   * Navega para visualizar uma atividade pública
   */
  navigateToVisualizarAtividade(atividadeId: number, cursoId?: number, cursoNome?: string): void {
    this.router.navigate(['/atividade-publica', atividadeId], {
      state: { cursoId, cursoNome }
    });
  }

  /**
   * Navega de volta para as atividades do curso
   */
  navigateBackToAtividades(cursoId: number, cursoNome?: string): void {
    this.router.navigate(['/atividades-publicas/curso', cursoId], {
      state: { cursoNome }
    });
  }

  /**
   * Navega de volta para a lista de cursos
   */
  navigateBackToCursos(): void {
    this.router.navigate(['/cursos-publicos']);
  }

  /**
   * Obtém informações do estado da navegação
   */
  getNavigationState(): any {
    const navigation = this.router.getCurrentNavigation();
    return navigation?.extras?.state || {};
  }

  /**
   * Obtém o nome do curso do estado atual
   */
  getCurrentCursoNome(): string {
    const state = this.getNavigationState();
    return state.cursoNome || '';
  }

  /**
   * Obtém o ID do curso do estado atual
   */
  getCurrentCursoId(): number | null {
    const state = this.getNavigationState();
    return state.cursoId || null;
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Método para buscar a lista de cursos do usuário autenticado
  // O token será adicionado automaticamente pelo interceptor
  getUserCourses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cursos/usuarios`);
  }

  getAllCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cursos`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cursos`, courseData);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias`);
  }

  updateCourse(id: number, courseData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/cursos/${id}`, courseData);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cursos/${id}`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias/${id}`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categorias`, categoryData);
  }

  updateCategory(id: number, categoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categorias/${id}`, categoryData);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categorias/${id}`);
  }
}

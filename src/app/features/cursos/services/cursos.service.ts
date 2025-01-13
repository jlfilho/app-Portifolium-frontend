import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private baseUrl = 'http://localhost:8080/api'; // Endpoint de login

  constructor(private http: HttpClient) {}

  // Método para buscar a lista de cursos do usuário autenticado
  getUserCourses(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado

    // Configura os headers com o token de autenticação
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Faz a requisição GET ao endpoint
    return this.http.get<any>(`${this.baseUrl}/cursos/usuarios`, { headers });
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
}

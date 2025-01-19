import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = 'http://localhost:8080/api'; // Endpoint de login

  constructor(private http: HttpClient) {}

   getAllUsuarios(): Observable<Usuario[]> {
    const token = localStorage.getItem('token'); // Obtém o token JWT armazenado

        // Configura os headers com o token de autenticação
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
      return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, { headers });
    }
}

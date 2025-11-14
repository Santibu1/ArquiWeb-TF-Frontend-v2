import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Usuario} from "../model/usuario";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
    private http = inject(HttpClient);
    // --- ¡CORRECCIÓN DE URL! ---
    // Tu controlador está en "/api/usuarios"
    private url = `${environment.apiUrl}/usuarios`;

    constructor() {}

    // --- MÉTODO CLAVE ---
    // Esto ahora llamará a http://localhost:8080/api/usuarios/mi-perfil
    getMiPerfil(): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.url}/mi-perfil`);
    }

    // GET (Listar todos - Admin)
    list(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.url}/listarUsuarios`);
    }

    // PUT (Actualizar)
    update(id: number, usuario: Usuario): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.url}/editarUsuario/${id}`, usuario);
    }

    // DELETE (Eliminar - Admin)
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/eliminarUsuario/${id}`);
    }
}

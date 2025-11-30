import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Usuario} from "../model/usuario";
import {UsuarioPlan} from "../model/usuario-plan";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
    private http = inject(HttpClient);
    // --- ¡CORRECCIÓN DE URL! ---
    // Tu controlador está en "/api/usuarios"
    private url = `${environment.apiUrl}/usuarios`;

    constructor() {}

    // --- METODO CLAVE ---
    // Esto ahora llamará a http://localhost:8080/api/usuarios/mi-perfil
    getMiPerfil(): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.url}/mi-perfil`);
    }

    getMiPlan(): Observable<UsuarioPlan> {
        return this.http.get<UsuarioPlan>(`${this.url}/mi-plan`);
    }


    // GET (Listar todos - Admin)
    list(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.url}/listarUsuarios`);
    }
    listarModeradores(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.url}/listarModeradores`);
    }

    listarClientes():  Observable<Usuario[]>{
        return this.http.get<Usuario[]>(`${this.url}/listarClientes`);
    }

    // PUT (Actualizar)
    update(id: number, usuario: Usuario): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.url}/editarUsuario/${id}`, usuario);
    }

    // DELETE (Eliminar - Admin)
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/eliminarUsuario/${id}`);
    }
    suspender(id: number) {
        return this.http.delete(`${this.url}/eliminarUsuario/${id}`);
    }

    reactivar(id: number) {
        return this.http.put(`${this.url}/reactivarUsuario/${id}`, {});
    }
    actualizarUsuario(id: number, usuario: Usuario) {
        return this.http.put<Usuario>(`${this.url}/editarUsuario/${id}`, usuario);
    }
    asignarPlan(usuarioId: number, planId: number) {
        return this.http.put<Usuario>(
            `${this.url}/Asignar-Plan-Usuario/${usuarioId}/plan/${planId}`,
            {}
        );
    }

}

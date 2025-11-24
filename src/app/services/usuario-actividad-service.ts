import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {UsuarioActividad} from "../model/usuario-actividad";

@Injectable({
    providedIn: 'root'
})
export class UsuarioActividadService {
    // Apunta a @RequestMapping("/usuario-actividad") de tu controller
    private url = `${environment.apiUrl}/usuario-actividad`;
    private http = inject(HttpClient);

    constructor() { }

    // POST /completar/{usuarioId}/{actividadId}
    completarActividad(usuarioId: number, actividadId: number): Observable<UsuarioActividad> {
        return this.http.post<UsuarioActividad>(`${this.url}/completar/${usuarioId}/${actividadId}`, {});
    }

    // GET /usuario/{usuarioId} -> Para saber qué actividades ya hizo el usuario
    listarActividadesPorUsuario(usuarioId: number): Observable<UsuarioActividad[]> {
        return this.http.get<UsuarioActividad[]>(`${this.url}/usuario/${usuarioId}`);
    }
}
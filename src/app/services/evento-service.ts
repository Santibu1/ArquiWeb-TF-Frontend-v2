import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Evento} from "../model/evento";
import {Observable} from "rxjs";
import {UsuarioEventoDto} from "../model/usuario-evento-dto";

@Injectable({
  providedIn: 'root',
})
export class EventoService {
    private url = `${environment.apiUrl}/eventos`;
    private urlUsuarioEvento = `${environment.apiUrl}/usuario-eventos`;
    private http = inject(HttpClient);

    // Crear Evento (Moderador)
    registrarEvento(evento: Evento): Observable<Evento> {
        return this.http.post<Evento>(`${this.url}/registrar`, evento);
    }

    // Listar Eventos por Comunidad
    listarPorComunidad(comunidadId: number): Observable<Evento[]> {
        return this.http.get<Evento[]>(`${this.url}/comunidad/${comunidadId}`);
    }

    // Inscribirse a un evento
    inscribirse(usuarioId: number, eventoId: number): Observable<UsuarioEventoDto> {
        return this.http.put<UsuarioEventoDto>(`${this.urlUsuarioEvento}/inscribirse/${usuarioId}/${eventoId}`, {});
    }

    // Ver mis inscripciones (para saber si ya estoy inscrito y deshabilitar botón)
    misInscripciones(usuarioId: number): Observable<UsuarioEventoDto[]> {
        return this.http.get<UsuarioEventoDto[]>(`${this.urlUsuarioEvento}/usuario/${usuarioId}`);
    }
    cancelarInscripcion(usuarioId: number, eventoId: number): Observable<void> {
        return this.http.delete<void>(`${this.urlUsuarioEvento}/cancelar/${usuarioId}/${eventoId}`);
    }
    listarParticipantes(eventoId: number): Observable<UsuarioEventoDto[]> {
        return this.http.get<UsuarioEventoDto[]>(`${this.urlUsuarioEvento}/evento/${eventoId}`);
    }
    confirmarAsistencia(eventoId: number, usuarioId: number): Observable<any> {
        return this.http.post(
            `${this.urlUsuarioEvento}/confirmar-asistencia/${eventoId}/${usuarioId}`,
            {}
        );
    }

    listarParticipantesConAsistencia(eventoId: number): Observable<UsuarioEventoDto[]> {
        return this.http.get<UsuarioEventoDto[]>(
            `${this.url}/eventos/${eventoId}/participantes-con-asistencia`
        );
    }

}

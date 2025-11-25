import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {UsuarioProductoRequestDto} from "../model/usuario-producto-request-dto";
import {UsuarioProductoResponseDto} from "../model/usuario-producto-response-dto";

@Injectable({
    providedIn: 'root'
})
export class UsuarioProductoService {
    // Asegúrate que environment.apiUrl sea 'http://localhost:8080/api'
    private url = `${environment.apiUrl}/usuario-producto`;
    private http = inject(HttpClient);

    constructor() { }

    // POST /canjear
    canjearProducto(request: UsuarioProductoRequestDto): Observable<UsuarioProductoResponseDto> {
        return this.http.post<UsuarioProductoResponseDto>(`${this.url}/canjear`, request);
    }

    // GET /historial/{usuarioId} (Opcional por ahora, pero útil para el futuro)
    verHistorial(usuarioId: number): Observable<UsuarioProductoResponseDto[]> {
        return this.http.get<UsuarioProductoResponseDto[]>(`${this.url}/historial/${usuarioId}`);
    }
}
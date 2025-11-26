import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Mensaje} from "../model/mensaje";

@Injectable({
  providedIn: 'root',
})
export class MensajeService {
    private apiUrl = environment.apiUrl + "/mensajes";
    private httpClient: HttpClient = inject(HttpClient);

    constructor(){}

    enviarMensaje(mensaje: Mensaje): Observable<Mensaje> {
        return this.httpClient.post<Mensaje>(`${this.apiUrl}/enviar`, mensaje);
    }

    listarMensajes(comunidadId: number): Observable<Mensaje[]> {
        return this.httpClient.get<Mensaje[]>(`${this.apiUrl}/comunidad/${comunidadId}`);
    }
}

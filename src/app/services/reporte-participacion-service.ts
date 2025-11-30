import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Solicitud} from "../model/solicitud";
import {Observable, Subject} from "rxjs";
import {ReporteParticipacion} from "../model/reporte-participacion";

@Injectable({
    providedIn: 'root',
})
export class ReporteParticipacionService {
    private url = environment.apiUrl + "/usuario-eventos";
    private httpClient: HttpClient = inject(HttpClient);

    constructor(private http: HttpClient) {}

    getReporteMensual(usuarioId: number, mes: number, anio: number):Observable<ReporteParticipacion>{
        return this.http.get<ReporteParticipacion>(`${this.url}/${usuarioId}/reportes?mes=${mes}&anio=${anio}`);

    }


}
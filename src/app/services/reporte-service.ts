// src/app/services/reporte.service.ts

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";
import {ReporteEmpresa} from "../model/reporte-empresa";

@Injectable({
    providedIn: 'root'
})
export class ReporteService {

    // Asumiendo que environment.apiURl = 'http://localhost:8080/api'
    // El controlador está en '/api/reportes'
    private url = environment.apiUrl + "/reportes";
    private httpClient: HttpClient = inject(HttpClient);

    constructor() { }

    /**
     * Llama al endpoint: GET /api/reportes/empresas
     */
    public getRankingEmpresas(): Observable<ReporteEmpresa[]> {
        // Asegúrate de usar backticks (`)
        return this.httpClient.get<ReporteEmpresa[]>(`${this.url}/empresas`);
    }

}
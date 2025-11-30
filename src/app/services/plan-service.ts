import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Plan } from '../model/plan';

@Injectable({
    providedIn: 'root',
})
export class PlanService {

    private http = inject(HttpClient);
    private url = environment.apiUrl;

    listarPlanesActivos(): Observable<Plan[]> {
        return this.http.get<Plan[]>(`${this.url}/Listar-Planes-Activos`);
    }
    obtenerPlanPorId(id: number): Observable<Plan> {
        return this.http.get<Plan>(`${this.url}/${id}`);
    }

}


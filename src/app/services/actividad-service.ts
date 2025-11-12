// src/app/services/actividad.service.ts

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Actividad} from '../model/actividad';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ActividadService {
    // La URL base viene de environment.ts, nos movemos a /api
    private url = environment.apiUrl;
    private httpClient: HttpClient = inject(HttpClient);

    // Subject para reactividad (como en tu ejemplo)
    private listaCambio: Subject<Actividad[]> = new Subject();

    constructor(){ }

    // GET (Listar todos)
    list(): Observable<Actividad[]> {
        return this.httpClient.get<Actividad[]>(this.url + "/listarActividades");
    }

    // GET (Listar por ID)
    listId(id: number): Observable<Actividad>{
        return this.httpClient.get<Actividad>(`${this.url}/listarActividadesPorID/${id}`);
    }

    // POST (Insertar)
    insert(actividad: Actividad){
        return this.httpClient.post(this.url + "/registrarActividad", actividad);
    }

    // PUT (Actualizar)
    // Tu backend espera el ID en la URL y el objeto en el body
    update(id: number, actividad: Actividad){
        return this.httpClient.put(`${this.url}/actualizarActividades/${id}`, actividad);
    }

    // DELETE (Eliminar)
    delete(id: number) {
        return this.httpClient.delete(`${this.url}/eliminar-Actividad/${id}`);
    }

    // --- Métodos para el Subject (Reactividad) ---

    setList(listaNueva: Actividad[]){
        this.listaCambio.next(listaNueva);
    }

    getListaCambio(){
        return this.listaCambio.asObservable();
    }

    // Método helper para refrescar la lista después de un Insert/Update/Delete
    actualizarLista() :void {
        this.list().subscribe({
            next: (data) => { this.setList(data); },
            error: (err: any) => console.error(err)
        });
    }
}
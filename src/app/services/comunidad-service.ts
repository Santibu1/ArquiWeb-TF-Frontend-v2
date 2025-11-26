// src/app/services/comunidad.service.ts

import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Comunidad} from '../model/comunidad'; // <-- CAMBIO
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ComunidadService { // <-- CAMBIO

    private url = environment.apiUrl + '/comunidades';
    private httpClient: HttpClient = inject(HttpClient);

    // Subject para reactividad
    private listaCambio: Subject<Comunidad[]> = new Subject(); // <-- CAMBIO

    constructor(){ }

    // GET (Listar todos)
    list(): Observable<Comunidad[]> { // <-- CAMBIO
        // Asumiendo endpoint: /listarComunidades
        return this.httpClient.get<Comunidad[]>(this.url + "/listar");
    }

    // GET (Listar por ID)
    listId(id: number): Observable<Comunidad>{ // <-- CAMBIO
        // Asumiendo endpoint: /listarComunidadesPorID/{id}
        return this.httpClient.get<Comunidad>(`${this.url}/listarComunidadesPorID/${id}`);
    }

    // POST (Insertar)
    insert(comunidad: Comunidad){ // <-- CAMBIO
        // Asumiendo endpoint: /registrarComunidad
        return this.httpClient.post(this.url + "/registrarComunidad", comunidad);
    }

    // PUT (Actualizar)
    update(id: number, comunidad: Comunidad){ // <-- CAMBIO
        // Asumiendo endpoint: /actualizarComunidades/{id}
        return this.httpClient.put(`${this.url}/actualizarComunidades/${id}`, comunidad);
    }

    // DELETE (Eliminar)
    delete(id: number) {
        // Asumiendo endpoint: /eliminar-Comunidad/{id}
        return this.httpClient.delete(`${this.url}/eliminar/${id}`);
    }

    unirAComunidad(idUsuario: number, idComunidad: number) {
        const dto = {
            idUsuario: idUsuario,
            idComunidad: idComunidad
        };
        return this.httpClient.post(`${this.url}/unir`, dto);
    }

    getMiComunidad(userId: number): Observable<Comunidad> {
        return this.httpClient.get<Comunidad>(`${this.url}/mi-comunidad/${userId}`);
    }

    // --- Métodos para el Subject (Reactividad) ---

    setList(listaNueva: Comunidad[]){ // <-- CAMBIO
        this.listaCambio.next(listaNueva);
    }

    getListaCambio(){
        return this.listaCambio.asObservable();
    }

    // Método helper para refrescar la lista
    actualizarLista() :void {
        this.list().subscribe({
            next: (data) => { this.setList(data); },
            error: (err: any) => console.error(err)
        });
    }
}
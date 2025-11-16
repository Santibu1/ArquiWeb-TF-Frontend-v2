// src/app/services/producto-service.ts

import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Producto} from "../model/producto";

@Injectable({
    providedIn: 'root',
})
export class ProductoService {
    private url = environment.apiUrl;
    private httpClient: HttpClient = inject(HttpClient);
    private listaCambio: Subject<Producto[]> = new Subject();

    constructor() {}

    // --- MÉTODO PARA EL ADMIN ---
    // (El que usa tu componente 'productos-listar-administrador')
    list(): Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(this.url + '/Listar-Todos-Productos');
    }

    // --- ¡NUEVO MÉTODO PARA USUARIOS! ---
    // (El que usarás en tu futura tienda para clientes)
    listActivos(): Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(this.url + '/Listar-Productos-Activos');
    }
    // ------------------------------------

    listarProductosPorEmpresa(empresaId: number): Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(
            `${this.url}/Productos-Por-Empresa/${empresaId}`
        );
    }

    listId(id: number): Observable<Producto> {
        return this.httpClient.get<Producto>(`${this.url}/Listar-Producto-Por/${id}`);
    }

    insert(producto: Producto) {
        return this.httpClient.post(this.url + '/Registrar-Producto', producto);
    }

    update(id: number, producto: Producto) {
        return this.httpClient.put(`${this.url}/Modificar-Producto/${id}`, producto);
    }

    delete(id: number) {
        return this.httpClient.delete(`${this.url}/Eliminar-Producto/${id}`);
    }

    // --- Métodos del Subject (Reactividad) ---
    // (Estos métodos seguirán actualizando la lista del ADMIN)
    setList(listaNueva: Producto[]) {
        this.listaCambio.next(listaNueva);
    }

    getListaCambio() {
        return this.listaCambio.asObservable();
    }

    actualizarLista(): void {
        this.list().subscribe({ // Llama al 'list()' del admin para refrescar
            next: (data) => {
                this.setList(data);
            },
            error: (err: any) =>
                console.error('Error en actualizarLista de ProductoService:', err),
        });
    }
}
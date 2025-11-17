import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable, Subject} from 'rxjs';
import {Empresa} from "../model/empresa";


@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
    // La URL base viene de environment.ts, nos movemos a /api
    private url = environment.apiUrl;
    private httpClient: HttpClient = inject(HttpClient);

    // Subject para reactividad (como en tu ejemplo)
    private listaCambio: Subject<Empresa[]> = new Subject();

    constructor(){ }
    // GET (Listar todos)
    list(): Observable<Empresa[]> {
        return this.httpClient.get<Empresa[]>(this.url + "/Listar-Empresas-Activas");
    }

    // GET (Listar por ID)
    listId(id: number): Observable<Empresa>{
        return this.httpClient.get<Empresa>(`${this.url}/Listar-Empresa-Por/${id}`);
    }

    // POST (Insertar)
    insert(empresa: Empresa){
        return this.httpClient.post(this.url + "/Registrar-Empresa", empresa);
    }

    // PUT (Actualizar)
    // Tu backend espera el ID en la URL y el objeto en el body
    update(id: number, empresa: Empresa){
        return this.httpClient.put(`${this.url}/Actualizar-Empresa/${id}`, empresa);
    }

    // DELETE (Eliminar)
    delete(id: number) {
        return this.httpClient.delete(`${this.url}/Eliminar-Empresa/${id}`);
    }
    // --- Métodos para el Subject (Reactividad) ---

    setList(listaNueva: Empresa[]){
        this.listaCambio.next(listaNueva);
    }

    getListaCambio(){
        return this.listaCambio.asObservable();
    }

    // Metodo helper para refrescar la lista después de un Insert/Update/Delete
    actualizarLista() :void {
        this.list().subscribe({
            next: (data) => { this.setList(data); },
            error: (err: any) => console.error("Error en actualizarLista de EmpresaService:", err)
        });
    }
}

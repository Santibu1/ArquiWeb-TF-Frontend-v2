import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Solicitud} from "../model/solicitud";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
    private url = environment.apiUrl + "/solicitudes";
    private httpClient: HttpClient = inject(HttpClient);

    private listaCambio: Subject<Solicitud[]> = new Subject();

    constructor(){}

    listarSolicitudes(): Observable<Solicitud[]> {
        return this.httpClient.get<Solicitud[]>(`${this.url}/listar`);
    }

    aprobarSolicitud(idSolicitud: number, adminId: number) {
        return this.httpClient.put(`${this.url}/${idSolicitud}/aprobar/${adminId}`, {});
    }

    rechazarSolicitud(idSolicitud: number, adminId: number) {
        return this.httpClient.put(`${this.url}/${idSolicitud}/rechazar/${adminId}`, {});
    }

    crearSolicitud(solicitud: Solicitud): Observable<Solicitud> {
        return this.httpClient.post<Solicitud>(`${this.url}/crear`, solicitud);
    }

    setList(listaNueva: Solicitud[]) {
        this.listaCambio.next(listaNueva);
    }

    getListaCambio(){
        return this.listaCambio.asObservable();
    }

    actualizarLista() :void {
        this.listarSolicitudes().subscribe({
            next: (data) => { this.setList(data); },
            error: (err: any) => console.error("Error en actualizar Lista de Solicitudes:", err)
        });
    }
}

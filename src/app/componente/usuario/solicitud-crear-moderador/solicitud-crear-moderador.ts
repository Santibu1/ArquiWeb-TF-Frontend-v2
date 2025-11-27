import { Component } from '@angular/core';
import {Solicitud} from "../../../model/solicitud";
import {SolicitudService} from "../../../services/solicitud-service";
import {FormsModule} from "@angular/forms";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-solicitud-crear-moderador',
    imports: [
        FormsModule,
        SubNavbarUsuario,
        NgIf
    ],
  templateUrl: './solicitud-crear-moderador.html',
  styleUrl: './solicitud-crear-moderador.css',
})
export class SolicitudCrearModerador {
    solicitud: Solicitud = new Solicitud();

    usuarioId = Number(localStorage.getItem('idUsuario'));

    mensaje: string = '';
    cargando = false;

    constructor(private solicitudService: SolicitudService) {}

    enviarSolicitud() {
        this.cargando = true;
        this.mensaje = '';

        this.solicitud.idModerador = this.usuarioId;
        this.solicitud.estado = 'Pendiente';

        this.solicitudService.crearSolicitud(this.solicitud).subscribe({
            next: (res) => {
                this.cargando = false;

                if (!res.success) {
                    this.mensaje = res.mensaje;
                    return;
                }

                this.mensaje = res.mensaje;
                this.solicitud = new Solicitud();
            },

            error: (err) => {
                this.cargando = false;
                console.error(err);
                this.mensaje = 'Error inesperado al enviar la solicitud.';
            },
        });
    }
}
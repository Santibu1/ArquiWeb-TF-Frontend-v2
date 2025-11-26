import { Component } from '@angular/core';
import {Mensaje} from "../../../model/mensaje";
import {MensajeService} from "../../../services/mensaje-service";
import {FormsModule} from "@angular/forms";
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {ComunidadService} from "../../../services/comunidad-service";

@Component({
  selector: 'app-comunidad-user',
    imports: [
        FormsModule,
        NgClass,
        DatePipe,
        CommonModule
    ],
  templateUrl: './comunidad-user.html',
  styleUrl: './comunidad-user.css',
})
export class ComunidadUser {

    comunidadId!: number;
    comunidad: any;

    mensajes: Mensaje[] = [];
    nuevoMensaje: string = '';

    intervalId: any;

    usuarioId = Number(localStorage.getItem('idUsuario'));
    usuarioNombre = localStorage.getItem('nombreUsuario') || 'Yo';

    constructor(
        private mensajeService: MensajeService,
        private comunidadService: ComunidadService
    ) {}

    ngOnInit(): void {
        this.comunidadService.getMiComunidad(this.usuarioId).subscribe({
            next: (data) => {
                this.comunidad = data;
                this.comunidadId = Number(data.idComunidad);
                this.cargarMensajes();
                this.activarAutoRefresh();
            }
        });
    }

    cargarMensajes() {
        this.mensajeService.listarMensajes(this.comunidadId).subscribe({
            next: (data) => {
                this.mensajes = data;
            }
        });
    }

    enviar() {
        if (!this.nuevoMensaje.trim()) return;

        const mensaje: Mensaje = {
            contenido: this.nuevoMensaje,
            comunidadId: this.comunidadId,
            usuarioId: this.usuarioId,
            usuarioNombre: this.usuarioNombre
        };

        this.mensajeService.enviarMensaje(mensaje).subscribe({
            next: (res) => {
                this.mensajes.push(res);
                this.nuevoMensaje = '';
            }
        });
    }

    activarAutoRefresh() {
        this.intervalId = setInterval(() => {
            this.cargarMensajes();
        }, 3000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

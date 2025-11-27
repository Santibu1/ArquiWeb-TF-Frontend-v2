import { Component } from '@angular/core';
import {Mensaje} from "../../../model/mensaje";
import {MensajeService} from "../../../services/mensaje-service";
import {FormsModule} from "@angular/forms";
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {ComunidadService} from "../../../services/comunidad-service";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {MiembroDto} from "../../../model/miembro-dto";

@Component({
  selector: 'app-comunidad-user',
    imports: [
        FormsModule,
        NgClass,
        DatePipe,
        CommonModule,
        SubNavbarUsuario
    ],
  templateUrl: './comunidad-user.html',
  styleUrl: './comunidad-user.css',
})
export class ComunidadUser {

    comunidadId!: number;
    comunidad: any;

    showMembers = false;
    comunidadNombre = "";
    miembrosModeradores: MiembroDto[] = [];
    miembrosClientes: MiembroDto[] = [];

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
                this.comunidadNombre = data.nombre;

                this.comunidadService.listarMiembrosComunidad(this.comunidadId).subscribe({
                    next: miembros => {
                        this.miembrosModeradores = miembros.filter(m => m.rol === 'MODERADOR');
                        this.miembrosClientes = miembros.filter(m => m.rol === 'CLIENTE');
                    }
                });

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

    toggleMembers() {
        this.showMembers = !this.showMembers;
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

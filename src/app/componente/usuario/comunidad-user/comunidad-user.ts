import { Component } from '@angular/core';
import {Mensaje} from "../../../model/mensaje";
import {MensajeService} from "../../../services/mensaje-service";
import {FormsModule} from "@angular/forms";
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {ComunidadService} from "../../../services/comunidad-service";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {MiembroDto} from "../../../model/miembro-dto";
import {Evento} from "../../../model/evento";
import {EventoService} from "../../../services/evento-service";
import {MatDialog} from "@angular/material/dialog";
import {CrearEventoDialog} from "./crear-evento-dialog/crear-evento-dialog";
import {VerParticipantesDialog} from "./ver-participantes-dialog/ver-participantes-dialog";

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
    // UI Flags
    showEventos = false;
    showMembers = false;

    // Datos
    eventos: Evento[] = [];
    mensajes: Mensaje[] = [];
    miembrosModeradores: MiembroDto[] = [];
    miembrosClientes: MiembroDto[] = [];

    // Lógica de usuario
    esModerador = false;
    inscripcionesIds: Set<number> = new Set(); // <--- SET IMPORTANTE

    comunidadId!: number;
    comunidad: any;
    comunidadNombre = "";
    nuevoMensaje: string = '';
    intervalId: any;

    usuarioId = Number(localStorage.getItem('idUsuario'));
    usuarioNombre = localStorage.getItem('nombreUsuario') || 'Yo';

    constructor(
        private mensajeService: MensajeService,
        private comunidadService: ComunidadService,
        private eventoService: EventoService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.comunidadService.getMiComunidad(this.usuarioId).subscribe({
            next: (data) => {
                this.comunidad = data;
                this.comunidadId = Number(data.idComunidad);
                this.comunidadNombre = data.nombre;

                // Cargar Miembros y determinar Rol
                this.comunidadService.listarMiembrosComunidad(this.comunidadId).subscribe({
                    next: miembros => {
                        this.miembrosModeradores = miembros.filter(m => m.rol === 'MODERADOR');
                        this.miembrosClientes = miembros.filter(m => m.rol === 'CLIENTE');
                        this.esModerador = this.miembrosModeradores.some(m => m.idUsuario === this.usuarioId);
                    }
                });

                // Cargas iniciales
                this.cargarMensajes();
                this.activarAutoRefresh();

                this.cargarEventos();
                this.cargarMisInscripciones(); // <--- ¡AQUÍ ESTABA FALTANDO!
            }
        });
    }
    cargarEventos() {
        this.eventoService.listarPorComunidad(this.comunidadId).subscribe({
            next: (data) => this.eventos = data
        });
    }
    // --- LÓGICA DE INSCRIPCIONES ---

    cargarMisInscripciones() {
        this.eventoService.misInscripciones(this.usuarioId).subscribe({
            next: (data) => {
                // Mapeamos los objetos para obtener solo los IDs de eventos
                const ids = data.map(item => item.eventoId);
                this.inscripcionesIds = new Set(ids);
                console.log('Inscripciones cargadas:', this.inscripcionesIds);
            },
            error: (err) => console.error(err)
        });
    }

    estoyInscrito(eventoId: number): boolean {
        return this.inscripcionesIds.has(eventoId);
    }

    inscribirse(evento: Evento) {
        if(confirm(`¿Deseas inscribirte al evento "${evento.nombre}"?`)){
            this.eventoService.inscribirse(this.usuarioId, evento.eventoId!).subscribe({
                next: () => {
                    alert('¡Inscripción exitosa!');
                    // Actualizamos el Set visualmente
                    this.inscripcionesIds.add(evento.eventoId!);
                    // Truco para forzar la detección de cambios en Angular si es necesario
                    this.inscripcionesIds = new Set(this.inscripcionesIds);
                },
                error: (e) => alert(e.error?.message || 'Error al inscribirse')
            });
        }
    }

    cancelarInscripcion(evento: Evento) {
        if(confirm(`¿Ya no podrás asistir a "${evento.nombre}"?`)){
            this.eventoService.cancelarInscripcion(this.usuarioId, evento.eventoId!).subscribe({
                next: () => {
                    alert('Inscripción cancelada.');
                    // Quitamos del Set
                    this.inscripcionesIds.delete(evento.eventoId!);
                    this.inscripcionesIds = new Set(this.inscripcionesIds);
                },
                error: (e) => alert('Error al cancelar')
            });
        }
    }

    // --- MODALES ---

    abrirCrearEvento() {
        const dialogRef = this.dialog.open(CrearEventoDialog, {
            width: '500px',
            data: { comunidadId: this.comunidadId }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.cargarEventos();
            }
        });
    }

    abrirParticipantes(eventoId: number) {
        this.dialog.open(VerParticipantesDialog, {
            width: '400px',
            data: { eventoId: eventoId }
        });
    }

    toggleEventos() {
        this.showEventos = !this.showEventos;
        if (this.showEventos) this.showMembers = false;
    }

    toggleMembers() {
        this.showMembers = !this.showMembers;
        if (this.showMembers) this.showEventos = false;
    }

    // --- CHAT ---

    cargarMensajes() {
        this.mensajeService.listarMensajes(this.comunidadId).subscribe({
            next: (data) => { this.mensajes = data; }
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

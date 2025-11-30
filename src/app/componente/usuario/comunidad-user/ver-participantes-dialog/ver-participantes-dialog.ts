import {Component, Inject, inject, OnInit} from '@angular/core';
import {EventoService} from "../../../../services/evento-service";
import {UsuarioEventoDto} from "../../../../model/usuario-evento-dto";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-ver-participantes-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './ver-participantes-dialog.html',
  styleUrl: './ver-participantes-dialog.css',
})
export class VerParticipantesDialog implements OnInit{
    private eventoService = inject(EventoService);
    participantes: UsuarioEventoDto[] = [];

    constructor(
                @Inject(MAT_DIALOG_DATA) public data: { eventoId: number }) {}

    ngOnInit(): void {
        this.eventoService.listarParticipantes(this.data.eventoId).subscribe({
            next: (res) => this.participantes = res,
            error: (e) => console.error(e)
        });
    }
    cargarParticipantes() {
        this.eventoService.listarParticipantesConAsistencia(this.data.eventoId).subscribe({
            next: (res) => this.participantes = res,
            error: (e) => console.error(e)
        });
    }

    confirmarAsistencia(participante: UsuarioEventoDto) {
        if (confirm(`¿Confirmar asistencia de ${participante.nombreUsuario}?`)) {
            this.eventoService.confirmarAsistencia(this.data.eventoId, participante.usuarioId).subscribe({
                next: () => {
                    alert('Asistencia confirmada');
                    // Actualizar localmente sin recargar
                    participante.asistenciaConfirmada = true;
                    participante.estado = 'Asistió';
                },
                error: (err) => {
                    alert('Error: ' + (err.error?.message || 'No se pudo confirmar'));
                }
            });
        }
    }

}

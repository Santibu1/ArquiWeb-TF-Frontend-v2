import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {UsuarioProductoService} from "../../../services/usuario-producto-service";
import {UsuarioProductoResponseDto} from "../../../model/usuario-producto-response-dto";

@Component({
  selector: 'app-historial-canjes-dialog',
    standalone: true,
  imports: [
      CommonModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatProgressSpinnerModule
  ],
  templateUrl: './historial-canjes-dialog.html',
  styleUrl: './historial-canjes-dialog.css',
})
export class HistorialCanjesDialog {
// Inyección de dependencias
    private service = inject(UsuarioProductoService);

    // Variables
    historial: UsuarioProductoResponseDto[] = [];
    loading: boolean = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { usuarioId: number },
        public dialogRef: MatDialogRef<HistorialCanjesDialog>
    ) {}

    ngOnInit(): void {
        if (this.data.usuarioId) {
            this.cargarHistorial();
        }
    }

    cargarHistorial(): void {
        this.service.verHistorial(this.data.usuarioId).subscribe({
            next: (data) => {
                this.historial = data;
                this.loading = false;
            },
            error: (e) => {
                console.error('Error al cargar historial', e);
                this.loading = false;
            }
        });
    }

    cerrar(): void {
        this.dialogRef.close();
    }
}

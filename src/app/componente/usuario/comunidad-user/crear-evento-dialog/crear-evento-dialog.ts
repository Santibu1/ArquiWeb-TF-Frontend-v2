import {Component, Inject, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EventoService} from "../../../../services/evento-service";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Evento} from "../../../../model/evento";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-crear-evento-dialog',
    standalone: true,
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-PE' },provideNativeDateAdapter()],
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
      MatDatepickerModule,
      MatNativeDateModule
  ],
  templateUrl: './crear-evento-dialog.html',
  styleUrl: './crear-evento-dialog.css',
})
export class CrearEventoDialog {
    private fb = inject(FormBuilder);
    private eventoService = inject(EventoService);

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CrearEventoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { comunidadId: number }
    ) {
        this.form = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(2)]],
            descripcion: ['', Validators.required],
            fecha: [new Date(), Validators.required],
            recompensa: [10, [Validators.required, Validators.min(1)]],
            beneficios: ['']
        });
    }

    guardar() {
        if (this.form.invalid) return;

        // Lógica para evitar que la fecha retroceda un día por la zona horaria (UTC vs Local)
        const fechaRaw = this.form.value.fecha as Date;
        const fechaAjustada = new Date(fechaRaw.getTime() - (fechaRaw.getTimezoneOffset() * 60000));
        const fechaISO = fechaAjustada.toISOString().split('T')[0];

        const nuevoEvento: Evento = {
            nombre: this.form.value.nombre,
            descripcion: this.form.value.descripcion,
            recompensa: this.form.value.recompensa,
            beneficios: this.form.value.beneficios,
            fecha: fechaISO,
            comunidadId: this.data.comunidadId,
            ubicacion: '' // El backend asignará la ubicación de la comunidad
        };

        this.eventoService.registrarEvento(nuevoEvento).subscribe({
            next: (res) => {
                // Cerramos el diálogo retornando 'true' para indicar éxito
                this.dialogRef.close(true);
            },
            error: (err) => {
                console.error(err);
                alert('Error al crear evento: ' + (err.error?.message || 'Verifique los datos'));
            }
        });
    }
}

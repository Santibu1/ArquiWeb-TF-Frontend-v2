// src/app/componente/administrador/actividades-nuevo-edit-administrador/actividades-nuevo-edit-administrador.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf y *ngFor

// --- Tus Modelos y Servicios ---
import { Actividad } from '../../../model/actividad'; // Ajusta la ruta

// --- Importaciones de Material (Estilo del Profesor) ---
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
// import { MatHint } from '@angular/material/form-field'; // Eliminado (no se usa)
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select'; // Para Categoria/Estado
import { MatOption, MatOptionModule } from '@angular/material/core';
import {ActividadService} from "../../../services/actividad-service";   // Para Categoria/Estado

@Component({
    selector: 'app-actividades-nuevo-edit-administrador',
    standalone: true,
    imports: [
        // --- Módulos de Angular ---
        ReactiveFormsModule, // ¡Esencial para [formGroup]!
        CommonModule,        // Para *ngIf, *ngFor
        RouterModule,

        // --- Directivas y Módulos de Material (Estilo Profesor) ---
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        // MatHint, // Eliminado (no se usa)
        MatInputModule,      // El profe también importa los módulos
        MatButtonModule,     // El profe también importa los módulos

        // Para nuestros <mat-select>
        MatSelect,
        MatOption,
        MatSelectModule,
        MatOptionModule
    ],
    // ¡¡CORRECCIÓN CLAVE!! El nombre de tu archivo es .component.html
    templateUrl: './actividades-nuevo-edit-administrador.html',
    styleUrl: './actividades-nuevo-edit-administrador.css'
})
export class ActividadesNuevoEditAdministradorComponent implements OnInit {

    // --- Propiedades (igual que el profesor) ---
    form: FormGroup;
    fb: FormBuilder = inject(FormBuilder);
    actividadService = inject(ActividadService);
    router = inject(Router);
    edicion: boolean = false;
    route: ActivatedRoute = inject(ActivatedRoute);
    id: number = 0;

    // --- Datos para los <mat-select> ---
    categorias: string[] = ['Reciclaje', 'Educación', 'Comunidad', 'Voluntariado'];
    estados: string[] = ['Activa', 'Inactiva'];

    constructor() {
        // --- Lógica del Constructor (idéntica, adaptada) ---
        this.form = this.fb.group({
            actividadId: [0],
            nombreActividad: ['', Validators.required],
            descripcionActividad: ['', Validators.required],
            recompensaActividad: [0, [Validators.required, Validators.min(1)]],
            categoriaActividad: ['', Validators.required],
            estadoActividad: ['', Validators.required],
            usuario_id: [null, Validators.required]
        });
    }

    // --- Lógica de ngOnInit (idéntica al profesor) ---
    ngOnInit() {
        this.route.params.subscribe(data => {
            this.id = data['id'];
            console.log("ID recibido:", this.id);
            this.edicion = data['id'] != null;
            if (this.edicion) {
                this.cargaForm(); // Solo cargamos si estamos editando
            }
        });
    }

    // --- Lógica de cargaForm (idéntica, adaptada) ---
    cargaForm() {

        this.actividadService.listId(this.id).subscribe({
            next: (data: any) => {

                this.form.patchValue({
                    actividadId: data.actividadId,
                    nombreActividad: data.nombreActividad,
                    descripcionActividad: data.descripcionActividad,
                    recompensaActividad: data.recompensaActividad,
                    categoriaActividad: data.categoriaActividad,
                    estadoActividad: data.estadoActividad,

                    usuario_id: data.usuarioId
                });
            },
            error: (err) => {
                console.error("Error al cargar la actividad para editar:", err);
            }
        });
    }

    onSubmit() {
        if (this.form.valid) {
            let actividad: any = this.form.value;

            // 🔧 Normalizamos el nombre para coincidir con el backend
            actividad.usuarioId = actividad.usuario_id;
            delete actividad.usuario_id;

            if (this.edicion) {
                // --- LÓGICA DE UPDATE ---
                this.actividadService.update(this.id, actividad).subscribe({
                    next: () => {
                        this.actividadService.actualizarLista();
                        this.router.navigate(['/admin/actividades']);
                    },
                    error: (err) => console.error("Error al actualizar:", err)
                });
            } else {
                // --- LÓGICA DE CREATE ---
                actividad.actividadId = null;
                this.actividadService.insert(actividad).subscribe({
                    next: () => {
                        this.actividadService.actualizarLista();
                        this.router.navigate(['/admin/actividades']);
                    },
                    error: (err) => console.error("Error al insertar:", err)
                });
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    // --- Botón Cancelar (extra) ---
    cancelar(): void {
        this.router.navigate(['/admin/actividades']);
    }
}
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOption, MatOptionModule } from '@angular/material/core';
import {EmpresaService} from "../../../services/empresa-service";
@Component({
  selector: 'app-empresas-nuevo-edit-administrador',
    standalone: true,
  imports: [ReactiveFormsModule,
      CommonModule,
      RouterModule,
      MatCard,
      MatCardContent,
      MatCardTitle,
      MatFormField,
      MatLabel,
      MatInput,
      MatButton,
      MatInputModule,
      MatButtonModule,
      MatSelect,
      MatOption,
      MatSelectModule,
      MatOptionModule],
  templateUrl: './empresas-nuevo-edit-administrador.html',
  styleUrl: './empresas-nuevo-edit-administrador.css',
})
export class EmpresasNuevoEditAdministrador implements OnInit {
    // --- Propiedades ---
    form: FormGroup;
    fb: FormBuilder = inject(FormBuilder);
    empresaService = inject(EmpresaService); // <-- Adaptado
    router = inject(Router);
    edicion: boolean = false;
    route: ActivatedRoute = inject(ActivatedRoute);
    id: number = 0;
// --- (¡AJUSTA ESTO!) Datos para los <mat-select> de Empresa ---
    categoriasEmpresa: string[] = ['Centro de Acopio', 'Recicladora', 'Transportista', 'ONG'];
    estadosEmpresa: string[] = ['Activa', 'Inactiva'];

    constructor() {
        // --- Lógica del Constructor (Adaptado a Empresa) ---
        this.form = this.fb.group({
            empresaId: [0],
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            categoria: ['', Validators.required],
            estado: ['', Validators.required],
            usuario_id: [null, Validators.required] // Mantenemos el mismo nombre de form
        });
    }

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

    cargaForm() {
        this.empresaService.listId(this.id).subscribe({
            next: (data: any) => {
                // Adaptamos el patchValue al modelo Empresa
                this.form.patchValue({
                    empresaId: data.empresaId,
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    categoria: data.categoria,
                    estado: data.estado,
                    // Asumimos que el backend devuelve 'usuarioId' (camelCase)
                    // igual que en tu ejemplo de Actividad
                    usuario_id: data.usuarioId
                });
            },
            error: (err) => {
                console.error("Error al cargar la empresa para editar:", err);
            }
        });
    }

    onSubmit() {
        if (this.form.valid) {
            let empresa: any = this.form.value;

            // 🔧 Normalizamos el nombre para coincidir con el backend
            // (Replicando la lógica de tu componente Actividad)
            empresa.usuarioId = empresa.usuario_id;
            delete empresa.usuario_id;

            if (this.edicion) {
                // --- LÓGICA DE UPDATE ---
                this.empresaService.update(this.id, empresa).subscribe({
                    next: () => {
                        this.empresaService.actualizarLista(); // ¡Reactividad!
                        this.router.navigate(['/admin/empresas']); // <-- Adaptado
                    },
                    error: (err) => console.error("Error al actualizar empresa:", err)
                });
            } else {
                // --- LÓGICA DE CREATE ---
                empresa.empresaId = null; // Aseguramos que el ID sea nulo
                this.empresaService.insert(empresa).subscribe({
                    next: () => {
                        this.empresaService.actualizarLista(); // ¡Reactividad!
                        this.router.navigate(['/admin/empresas']); // <-- Adaptado
                    },
                    error: (err) => console.error("Error al insertar empresa:", err)
                });
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    cancelar(): void {
        this.router.navigate(['/admin/empresas']); // <-- Adaptado
    }

}

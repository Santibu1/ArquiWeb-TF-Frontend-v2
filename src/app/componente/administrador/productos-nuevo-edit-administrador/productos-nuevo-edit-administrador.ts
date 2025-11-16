// src/app/componente/administrador/productos-nuevo-edit-administrador/productos-nuevo-edit-administrador.ts

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- Imports de Material ---
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOption, MatOptionModule } from '@angular/material/core';

// --- Imports de Producto y Empresa ---
import { ProductoService } from "../../../services/producto-service";
import { EmpresaService } from "../../../services/empresa-service";
import { Empresa } from "../../../model/empresa";
import { Producto } from "../../../model/producto"; // Asegúrate de que el modelo esté correcto

@Component({
    selector: 'app-productos-nuevo-edit-administrador',
    standalone: true,
    imports: [
        ReactiveFormsModule,
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
        MatOptionModule
    ],
    templateUrl: './productos-nuevo-edit-administrador.html',
    styleUrl: './productos-nuevo-edit-administrador.css',
})
export class ProductosNuevoEditAdministrador implements OnInit {
    // --- Propiedades ---
    form: FormGroup;
    fb: FormBuilder = inject(FormBuilder);
    productoService = inject(ProductoService);
    empresaService = inject(EmpresaService); // Para el combobox de empresas
    router = inject(Router);
    route: ActivatedRoute = inject(ActivatedRoute);

    edicion: boolean = false;
    id: number = 0;

    // --- Datos para los <mat-select> de Producto ---
    categoriasProducto: string[] = ['Plástico', 'Vidrio', 'Papel', 'Cartón', 'Metal', 'Orgánico'];
    estadosProducto: string[] = ['Activo', 'Inactivo'];
    empresas: Empresa[] = []; // Para el combobox dinámico

    constructor() {
        // --- Lógica del Constructor (Adaptado a Producto) ---
        this.form = this.fb.group({
            productoId: [0],
            nombre: ['', Validators.required],
            categoria: ['', Validators.required],
            // Validadores de tu DTO
            precio: [0, [Validators.required, Validators.min(1)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            estado: ['', Validators.required],
            // Este es el Foreign Key
            empresaId: [null, Validators.required]
        });
    }

    ngOnInit() {
        // Cargar empresas para el combobox
        this.cargaEmpresas();

        // Comprobar si es edición
        this.route.params.subscribe(data => {
            this.id = data['id'];
            console.log("ID recibido:", this.id);
            this.edicion = data['id'] != null;
            if (this.edicion) {
                this.cargaForm(); // Solo cargamos si estamos editando
            }
        });
    }

    // Carga la lista de empresas para el <mat-select>
    cargaEmpresas(): void {
        this.empresaService.list().subscribe({
            next: (data) => {
                this.empresas = data;
            },
            error: (err) => console.error("Error al cargar empresas:", err)
        });
    }

    // Carga los datos del producto en el formulario si es edición
    cargaForm() {
        this.productoService.listId(this.id).subscribe({
            next: (data: Producto) => {
                // Los nombres del modelo (producto.ts) y del formGrup coinciden
                this.form.patchValue(data);
            },
            error: (err) => {
                console.error("Error al cargar el producto para editar:", err);
            }
        });
    }

    onSubmit() {
        if (this.form.valid) {
            let producto: Producto = this.form.value;

            if (this.edicion) {
                // --- LÓGICA DE UPDATE ---
                this.productoService.update(this.id, producto).subscribe({
                    next: () => {
                        this.productoService.actualizarLista();
                        this.router.navigate(['/admin/productos']);
                    },
                    error: (err) => console.error("Error al actualizar producto:", err)
                });

            } else {
                // --- LÓGICA DE CREATE ---

                // ¡¡AQUÍ ESTÁ LA CORRECCIÓN!!
                // Asegúrate de que el ID sea nulo para un producto nuevo.
                producto.productoId = null;

                if (!producto.estado) {
                    producto.estado = 'Activo';
                }

                this.productoService.insert(producto).subscribe({
                    next: () => {
                        this.productoService.actualizarLista();
                        this.router.navigate(['/admin/productos']);
                    },
                    error: (err) => console.error("Error al insertar producto:", err)
                });
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    cancelar(): void {
        this.router.navigate(['/admin/productos']); // <-- Adaptado a productos
    }
}
import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Usuario } from "../../../model/usuario";
import { UsuarioService } from "../../../services/usuario-service";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// Angular Material standalone imports
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    selector: 'app-usuarios-listar-administrador',
    standalone: true,
    templateUrl: './usuarios-listar-administrador.html',
    styleUrl: './usuarios-listar-administrador.css',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
    ],
})
export class UsuariosListarAdministrador {

    displayedColumns: string[] = [
        'usuarioId',
        'nombreUsuario',
        'apellidoUsuario',
        'emailUsuario',
        'edadUsuario',
        'ecobits',
        'rolId',
        'acciones'
    ];

    dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();
    rolSeleccionado: string = "TODOS";

    private usuarioService: UsuarioService = inject(UsuarioService);
    private router: Router = inject(Router);
    private snackBar: MatSnackBar = inject(MatSnackBar);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit() {
        this.cargarTodos();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargarTodos(): void {
        this.usuarioService.list().subscribe({
            next: (data) => {
                console.log("USUARIOS RECIBIDOS:", data);
                this.dataSource.data = data.filter(u => u.rolId !== 1);
                // IMPORTANTE: volver a asignar paginador y sort
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        });
    }
    filtrarPorRol(): void {
        if (this.rolSeleccionado === "MODERADOR") {
            this.usuarioService.listarModeradores().subscribe({
                next: (data) => {
                    this.dataSource.data = data.filter(u => u.rolId !== 1);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                },
            });
        }
        else if (this.rolSeleccionado === "CLIENTE") {
            this.usuarioService.listarClientes().subscribe({
                next: (data) => {
                    this.dataSource.data = data.filter(u => u.rolId !== 1);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                },
            });
        }
        else {
            // TODOS → también excluir ADMIN
            this.usuarioService.list().subscribe({
                next: (data) => {
                    this.dataSource.data = data.filter(u => u.rolId !== 1);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            });
        }
    }

    // ... código anterior ...

    suspenderUsuario(id: number): void {
        if (!confirm("¿Seguro que deseas suspender este usuario?")) return;

        this.usuarioService.suspender(id).subscribe({
            next: () => {
                // **REEMPLAZO DE alert() por MatSnackBar**
                this.snackBar.open("Usuario suspendido. Motivo: Mala Conducta", "CERRAR", {
                    duration: 5000, // Duración de 5 segundos
                    panelClass: ['snackbar-warn'] // Clase CSS opcional para estilo
                });

                this.filtrarPorRol();
            },
            // Manejo básico de errores (opcional)
            error: (err) => {
                this.snackBar.open("Error al suspender el usuario.", "CERRAR", {
                    duration: 5000,
                    panelClass: ['snackbar-error']
                });
            }
        });
    }

    reactivarUsuario(id: number): void {
        if (!confirm("¿Reactivar este usuario?")) return;

        this.usuarioService.reactivar(id).subscribe({
            next: () => {
                // **REEMPLAZO DE alert() por MatSnackBar**
                this.snackBar.open("Usuario reactivado con éxito.", "CERRAR", {
                    duration: 5000,
                    panelClass: ['snackbar-success']
                });

                this.filtrarPorRol();
            },
            // Manejo básico de errores (opcional)
            error: (err) => {
                this.snackBar.open("Error al reactivar el usuario.", "CERRAR", {
                    duration: 5000,
                    panelClass: ['snackbar-error']
                });
            }
        });
    }
}

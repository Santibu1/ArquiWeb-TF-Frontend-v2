
import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Para [routerLink]
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor

// --- IMPORTA LOS MÓDULOS COMPLETOS ---
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- Tus Modelos y Servicios ---
import { Actividad } from '../../../model/actividad';
import {ActividadService} from "../../../services/actividad-service"; // Ajusta la ruta si es necesario

@Component({
    selector: 'app-actividades-listar-administrador',
    standalone: true, // <-- Mantenemos esto como 'standalone'
    imports: [
        // --- Módulos de Angular ---
        CommonModule,
        RouterModule,


        // --- Módulos de Angular Material (El método seguro) ---
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './actividades-listar-administrador.html',
    styleUrl: './actividades-listar-administrador.css'
})
export class ActividadesListarAdministradorComponent implements OnInit, AfterViewInit {

    // Columnas a mostrar (incluyendo 'acciones' para botones)
    displayedColumns: string[] = [
        'actividadId',
        'nombreActividad',
        'descripcionActividad',
        'recompensaActividad',
        'categoriaActividad',
        'estadoActividad',
        'acciones'
    ];

    dataSource: MatTableDataSource<Actividad> = new MatTableDataSource<Actividad>();

    // ViewChild para Paginator y Sort
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // Inyección de servicios
    private actividadService: ActividadService = inject(ActividadService);
    private router: Router = inject(Router);

    constructor() {
        // Escuchar cambios en la lista (para refrescar después de crear/editar/borrar)
        this.actividadService.getListaCambio().subscribe((data) => {
            this.dataSource.data = data;
            this.dataSource._updateChangeSubscription();
        });
    }

    ngOnInit() {
        console.log('Cargando datos...');
        this.cargaDatos();
    }

    ngAfterViewInit() {
        // Asignar paginador y ordenador al dataSource
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargaDatos(): void {
        this.actividadService.list().subscribe({
            next: (data) => {
                console.log("Data recibida:", data);
                this.dataSource.data = data;
                // Asignar de nuevo por si los datos llegan después de la vista
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error("Error al cargar actividades:", err);
            }
        });
    }

    // --- Métodos del CRUD ---
    editarActividad(id: number): void {

        this.router.navigate(['/admin/actividad/editar', id]);
    }

    eliminarActividad(id: number): void {
        if (confirm('¿Está seguro de que desea eliminar esta actividad?')) {
            this.actividadService.delete(id).subscribe({
                next: () => {
                    console.log("Actividad eliminada");
                    // Opción 1: Recargar todo
                    // this.cargaDatos();

                    // Opción 2: Usar el Subject para refrescar (preferido)
                    this.actividadService.actualizarLista();
                },
                error: (err) => {
                    console.error("Error al eliminar:", err);
                }
            });
        }
    }
}
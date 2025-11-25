import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- IMPORTA LOS MÓDULOS COMPLETOS ---
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- Tus Modelos y Servicios ---
import { Comunidad } from '../../../model/comunidad';
import { ComunidadService } from "../../../services/comunidad-service";

@Component({
    selector: 'app-comunidades-listar-administrador',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: 'comunidades-listar-administrador.html',
    styleUrl : 'comunidades-listar-administrador.css',
})
export class ComunidadesListarAdministradorComponent implements OnInit, AfterViewInit {

    displayedColumns: string[] = [
        'idComunidad',           // <-- CORREGIDO
        'nombre',        // <-- CORREGIDO
        'ubicacion',              // <-- CORREGIDO
        'estado',
        'acciones'
    ];

    dataSource: MatTableDataSource<Comunidad> = new MatTableDataSource<Comunidad>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    private comunidadService: ComunidadService = inject(ComunidadService);
    private router: Router = inject(Router);

    constructor() {
        this.comunidadService.getListaCambio().subscribe((data) => {
            this.dataSource.data = data;
            this.dataSource._updateChangeSubscription();
        });
    }

    ngOnInit() {
        console.log('Cargando datos de comunidades...');
        this.cargaDatos();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargaDatos(): void {
        this.comunidadService.list().subscribe({
            next: (data) => {
                console.log("Data recibida:", data);
                this.dataSource.data = data;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error("Error al cargar comunidades:", err);
            }
        });
    }

    eliminarComunidad(id: number): void {
        if (confirm('¿Está seguro de que desea eliminar esta comunidad?')) {
            this.comunidadService.delete(id).subscribe({
                next: () => {
                    console.log("Comunidad eliminada");
                    this.comunidadService.actualizarLista();
                },
                error: (err) => {
                    console.error("Error al eliminar:", err);
                }
            });
        }
    }

    suspenderComunidad(id: number): void {
        console.log("SUSPENDER (lógica pendiente):", id);
        alert('Lógica para SUSPENDER no implementada.');
    }

    toggleEstado(element: Comunidad): void {
        const nuevoEstado = element.estado === 'Activo' ? 'Inactivo' : 'Activo';  // <-- Cambio aquí
        console.log(`TOGGLE ESTADO (lógica pendiente): ${element.idComunidad} -> ${nuevoEstado}`);
        alert(`Lógica para cambiar estado a ${nuevoEstado.toUpperCase()} no implementada.`);
    }
}
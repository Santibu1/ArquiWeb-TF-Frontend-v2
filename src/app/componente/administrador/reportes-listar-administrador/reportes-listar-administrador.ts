// src/app/componente/administrador/reportes-listar-administrador/reportes-listar-administrador.component.ts

import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import {ReporteEmpresa} from "../../../model/reporte-empresa";
import {ReporteService} from "../../../services/reporte-service";
import {MatIconModule} from "@angular/material/icon"; // Para futuros enlaces

// --- 1. Importa tu nuevo modelo y servicio ---

@Component({
    selector: 'app-reportes-listar-administrador',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule
        // (Añadiremos MatButtonModule, MatIconModule si queremos un botón de "detalle")
    ],
    templateUrl: './reportes-listar-administrador.html',
    styleUrl: './reportes-listar-administrador.css'
})
export class ReportesListarAdministradorComponent implements OnInit, AfterViewInit {

    // --- 2. Define las columnas para el reporte (coinciden con el DTO) ---
    displayedColumns: string[] = [
        'empresaId',
        'nombreEmpresa',
        'cantidadReclamos'
    ];

    // --- 3. Usa el DTO del reporte ---
    dataSource: MatTableDataSource<ReporteEmpresa> = new MatTableDataSource<ReporteEmpresa>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // --- 4. Inyecta el NUEVO servicio ---
    private reporteService: ReporteService = inject(ReporteService);

    constructor() { }

    ngOnInit() {
        this.cargaReporte();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargaReporte(): void {
        // Llama al servicio para obtener el ranking
        this.reporteService.getRankingEmpresas().subscribe({
            next: (data) => {
                console.log("Reporte cargado:", data);
                this.dataSource.data = data;
                // Asigna el paginador y sort aquí también por si los datos llegan tarde
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error("Error al cargar el reporte:", err);
                // NOTA: Si este error es un 403, es por el @PreAuthorize
                // que comentaste en tu controller.
            }
        });
    }

    // Opcional: Filtro para la tabla
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
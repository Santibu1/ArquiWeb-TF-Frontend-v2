import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {Empresa} from "../../../model/empresa";
import {EmpresaService} from "../../../services/empresa-service";
@Component({
  selector: 'app-empresas-listar-administrador',
    standalone: true,
  imports: [
      CommonModule,
      RouterModule,
      MatTableModule,
      MatSortModule,
      MatPaginatorModule,
      MatButtonModule,
      MatIconModule],
  templateUrl: './empresas-listar-administrador.html',
  styleUrl: './empresas-listar-administrador.css',
})
export class EmpresasListarAdministrador implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'empresaId',
        'nombre',
        'categoria',
        'descripcion',
        'estado',
        'acciones'];
    dataSource: MatTableDataSource<Empresa> = new MatTableDataSource<Empresa>();

    // ViewChild para Paginator y Sort
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    // Inyección de servicios
    private empresaService: EmpresaService = inject(EmpresaService);
    private router: Router = inject(Router);

    constructor() {
        // Escuchar cambios en la lista (para refrescar después de crear/editar/borrar)
        this.empresaService.getListaCambio().subscribe((data) => {
            this.dataSource.data = data;
            this.dataSource._updateChangeSubscription();
        });
    }

    ngOnInit() {
        console.log('Cargando datos de empresas...');
        this.cargaDatos();
    }

    ngAfterViewInit() {
        // Asignar paginador y ordenador al dataSource
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargaDatos(): void {
        this.empresaService.list().subscribe({
            next: (data) => {
                console.log("Data recibida:", data);
                this.dataSource.data = data;
                // Asignar de nuevo por si los datos llegan después de la vista
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error("Error al cargar empresas:", err);
            }
        });
    }

    // --- Métodos del CRUD ---
    editarEmpresa(id: number): void {
        // Ajusta la ruta según tu enrutador
        this.router.navigate(['/admin/empresa/editar', id]);
    }

    eliminarEmpresa(id: number): void {
        if (confirm('¿Está seguro de que desea eliminar esta empresa?')) {
            this.empresaService.delete(id).subscribe({
                next: () => {
                    console.log("Empresa eliminada");
                    // Opción 2: Usar el Subject para refrescar (preferido)
                    this.empresaService.actualizarLista();
                },
                error: (err) => {
                    console.error("Error al eliminar:", err);
                }
            });
        }
    }
}

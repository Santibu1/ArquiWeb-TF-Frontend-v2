import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';

// Imports de Angular Material
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Producto} from "../../../model/producto";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';

// Services y Models
import {ProductoService} from "../../../services/producto-service";
import {Empresa} from "../../../model/empresa";
import {EmpresaService} from "../../../services/empresa-service";

@Component({
    selector: 'app-productos-listar-administrador',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        // No necesitas CurrencyPipe aquí, ya está en CommonModule (implícitamente)
        // o se usa en el template directamente.
    ],
    templateUrl: './productos-listar-administrador.html',
    styleUrl: './productos-listar-administrador.css',
})
export class ProductosListarAdministrador implements OnInit, AfterViewInit{


    displayedColumns: string[] = [
        'productoId',
        'nombre',
        'categoria',
        'precio',
        'stock',
        'estado',
        'acciones',
    ];
    dataSource: MatTableDataSource<Producto> = new MatTableDataSource<Producto>();

    // Variables para el filtro
    empresas: Empresa[] = [];
    empresaSeleccionada: number | null = null; // Para el ngModel del select

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    private productoService: ProductoService = inject(ProductoService);
    private empresaService: EmpresaService = inject(EmpresaService);
    private router: Router = inject(Router);

    constructor() {
        this.productoService.getListaCambio().subscribe((data) => {
            this.dataSource.data = data;
            this.dataSource._updateChangeSubscription();
        });
    }

    ngOnInit() {
        console.log('Cargando datos de productos...');
        this.cargaDatos();
        this.cargaEmpresas(); // Cargar empresas para el combobox
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargaDatos(): void {
        this.productoService.list().subscribe({
            next: (data) => {
                this.dataSource.data = data;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error('Error al cargar productos:', err);
            },
        });
    }

    cargaEmpresas(): void {
        this.empresaService.list().subscribe({
            next: (data) => {
                this.empresas = data;
            },
            error: (err) => {
                console.error('Error al cargar empresas:', err);
            },
        });
    }

    aplicarFiltro(): void {
        if (this.empresaSeleccionada) {
            this.productoService
                .listarProductosPorEmpresa(this.empresaSeleccionada)
                .subscribe({
                    next: (data) => {
                        this.dataSource.data = data;
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    },
                    error: (err) => {
                        console.error('Error al filtrar productos por empresa:', err);
                    },
                });
        } else {
            this.cargaDatos();
        }
    }

    limpiarFiltro(): void {
        this.empresaSeleccionada = null;
        this.cargaDatos();
    }

    editarProducto(id: number): void {
        this.router.navigate(['/admin/producto/editar', id]);
    }

    eliminarProducto(id: number): void {
        if (confirm('¿Está seguro de que desea eliminar este producto?')) {
            this.productoService.delete(id).subscribe({
                next: () => {
                    console.log('Producto eliminado (baja lógica)');
                    this.limpiarFiltro();
                },
                error: (err) => {
                    console.error('Error al eliminar:', err);
                },
            });
        }
    }
}
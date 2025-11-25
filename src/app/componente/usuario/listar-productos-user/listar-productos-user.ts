import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProductoService} from "../../../services/producto-service";
import {EmpresaService} from "../../../services/empresa-service";
import {UsuarioService} from "../../../services/usuario-service";
import {UsuarioProductoService} from "../../../services/usuario-producto-service";
import {Producto} from "../../../model/producto";
import {Empresa} from "../../../model/empresa";
import {Usuario} from "../../../model/usuario";
import {UsuarioProductoRequestDto} from "../../../model/usuario-producto-request-dto";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {HistorialCanjesDialog} from "../historial-canjes-dialog/historial-canjes-dialog";

@Component({
  selector: 'app-listar-productos-user',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        SubNavbarUsuario,
        MatDialogModule
    ],
  templateUrl: './listar-productos-user.html',
  styleUrl: './listar-productos-user.css',
})
export class ListarProductosUser {
// Inyecciones
    private productoService = inject(ProductoService);
    private empresaService = inject(EmpresaService);
    private usuarioService = inject(UsuarioService);
    private transaccionService = inject(UsuarioProductoService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    // Datos
    productos: Producto[] = [];          // Todos los productos activos
    productosFiltrados: Producto[] = []; // Lista que se muestra en pantalla
    empresas: Empresa[] = [];
    usuarioActual: Usuario | null = null;
    loading = true;

    // Filtros
    filtroTexto: string = '';
    filtroEmpresaId: number | null = null;

    ngOnInit(): void {
        this.cargarDatosIniciales();
    }

    cargarDatosIniciales() {
        this.loading = true;

        // 1. Obtener Usuario (Para saber sus EcoBits)
        this.usuarioService.getMiPerfil().subscribe(u => this.usuarioActual = u);

        // 2. Cargar Empresas (Para el select)
        this.empresaService.list().subscribe(e => this.empresas = e);

        // 3. Cargar Productos Activos
        this.productoService.listActivos().subscribe({
            next: (data) => {
                this.productos = data;
                this.productosFiltrados = data; // Inicialmente mostramos todo
                this.loading = false;
            },
            error: (e) => {
                console.error(e);
                this.loading = false;
            }
        });
    }

    // --- LÓGICA DE FILTRADO ---
    aplicarFiltros() {
        this.productosFiltrados = this.productos.filter(p => {
            // 1. Filtro por Texto (Nombre)
            const coincideTexto = p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());

            // 2. Filtro por Empresa
            // Nota: Asegúrate que tu modelo Producto tenga 'empresaId' o un objeto 'empresa' con id
            // Aquí asumo p.empresaId como definiste en tu contexto inicial
            const coincideEmpresa = this.filtroEmpresaId ? p.empresaId === this.filtroEmpresaId : true;

            return coincideTexto && coincideEmpresa;
        });
    }

    limpiarFiltros() {
        this.filtroTexto = '';
        this.filtroEmpresaId = null;
        this.productosFiltrados = [...this.productos];
    }

    // --- LÓGICA DE CANJE ---
    onCanjear(producto: Producto) {
        if (!this.usuarioActual) return;

        // Validación Frontend Rápida
        if (this.usuarioActual.ecobits < producto.precio) {
            this.snackBar.open(`Te faltan ${producto.precio - this.usuarioActual.ecobits} Ecobits :(`, 'Cerrar', { duration: 3000 });
            return;
        }

        if (confirm(`¿Canjear "${producto.nombre}" por ${producto.precio} EcoBits?`)) {

            const request: UsuarioProductoRequestDto = {
                usuarioId: this.usuarioActual.usuarioId,
                productoId: producto.productoId!
            };

            this.loading = true; // Mostramos carga brevemente

            this.transaccionService.canjearProducto(request).subscribe({
                next: (resp) => {
                    this.loading = false;
                    // Éxito
                    this.snackBar.open(`¡Canje Exitoso! Disfruta tu ${resp.producto}`, 'GENIAL', {
                        duration: 5000,
                        panelClass: ['success-snackbar']
                    });

                    // Actualizar UI: Restar Stock localmente y Restar Puntos usuario
                    producto.stock -= 1;
                    this.usuarioActual!.ecobits -= producto.precio;

                    // Opcional: Recargar todo por seguridad
                    // this.cargarDatosIniciales();
                },
                error: (err) => {
                    this.loading = false;
                    // Manejo del error que viene del Map del backend
                    const msg = err.error?.message || 'Error al procesar el canje';
                    this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
                }
            });
        }
    }
    verHistorial() {
        if (!this.usuarioActual) return;

        this.dialog.open(HistorialCanjesDialog, {
            width: '450px',
            data: { usuarioId: this.usuarioActual.usuarioId }
        });
    }
}

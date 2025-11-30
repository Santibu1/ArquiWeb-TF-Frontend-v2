import {Component, inject, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {Router, RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {Solicitud} from "../../../model/solicitud";
import {SolicitudService} from "../../../services/solicitud-service";

@Component({
  selector: 'app-solicitudes-listar-administrador',
    imports: [
        CommonModule,
        RouterModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule
    ],
  templateUrl: './solicitudes-listar-administrador.html',
  styleUrl: './solicitudes-listar-administrador.css',
})
export class SolicitudesListarAdministrador {
    displayedColumns: string[] = [
        'idSolicitud',
        'nombreComunidad',
        'ubicacion',
        'descripcion',
        'estado',
        'acciones'
    ];
    dataSource: MatTableDataSource<Solicitud> = new MatTableDataSource<Solicitud>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    private solicitudService: SolicitudService = inject(SolicitudService);
    private router: Router = inject(Router);

    adminId: number = Number(localStorage.getItem("idUsuario"));

    constructor() {
        this.solicitudService.getListaCambio().subscribe((data) => {
            this.dataSource.data = data;
            this.dataSource._updateChangeSubscription();
        });
    }

    ngOnInit() {
        console.log('Cargando datos de solicitudes...');
        this.cargaDatos();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cargaDatos(): void {
        this.solicitudService.listarSolicitudes().subscribe({
            next: (data) => {
                console.log("Data recibida:", data);
                this.dataSource.data = data;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error("Error al cargar solicitudes:", err);
            }
        });
    }

    aprobar(idSolicitud: number, estado: string) {

        if (estado === "Rechazada") {
            alert("Esta solicitud ya fue rechazada, no se puede cambiar")
        }
        if (estado === "Aprobada") {
            alert("Esta solicitud ya fue aprobada")
        }
        if (estado === "Pendiente") {
            this.solicitudService.aprobarSolicitud(idSolicitud, this.adminId).subscribe({
                next: (data) => {
                    console.log("Solicitud aprobada:", data);
                    this.solicitudService.actualizarLista();
                },
                error: (err) => {
                    console.error("Error al aprobar:", err);
                }
            });
        }
    }

    rechazar(idSolicitud: number, estado: string) {

        if (estado === "Aprobada") {
            alert("Esta solicitud ya fue aprobada, no se puede cambiar")
        }
        if (estado === "Rechazada") {
            alert("Esta solicitud ya fue rechazada")
        }
        if (estado === "Pendiente") {
            this.solicitudService.rechazarSolicitud(idSolicitud, this.adminId).subscribe({
                next: (data) => {
                    console.log("Solicitud rechazada:", data);
                    this.solicitudService.actualizarLista();
                },
                error: (err) => {
                    console.error("Error al rechazar:", err);
                }
            });
        }
    }
}

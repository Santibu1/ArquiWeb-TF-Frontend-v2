import {Component, inject} from '@angular/core';
import {ComunidadService} from "../../../services/comunidad-service";
import {CommonModule} from "@angular/common";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {Router} from "@angular/router";

@Component({
  selector: 'app-listar-comunidades-user',
    imports: [
        CommonModule,
        SubNavbarUsuario,
    ],
  templateUrl: './listar-comunidades-user.html',
  styleUrl: './listar-comunidades-user.css',
})
export class ListarComunidadesUser {
    comunidades: any[] = [];
    idUsuarioLogueado!: number;
    private router = inject(Router);

    constructor(private comunidadService: ComunidadService) {}

    ngOnInit(): void {
        this.idUsuarioLogueado = Number(localStorage.getItem('idUsuario'));
        this.cargarComunidades();
    }

    cargarComunidades() {
        this.comunidadService.list().subscribe({
            next: data => {
                this.comunidades = data;
            }
        });
    }

    unirse(idComunidad: number) {

        this.comunidadService.unirAComunidad(this.idUsuarioLogueado, idComunidad)
            .subscribe({
                next: data => {
                    alert("Te uniste a la comunidad correctamente");
                    this.cargarComunidades();
                    this.router.navigate(['/usuario/home']);
                },
                error: err => {
                    alert("No se pudo unir: " + err.error);
                }
            });
    }
}

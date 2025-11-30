import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {ComunidadService} from "../../../services/comunidad-service";
import {UsuarioService} from "../../../services/usuario-service";
import {Usuario} from "../../../model/usuario";

@Component({
  selector: 'app-sub-navbar-usuario',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sub-navbar-usuario.html',
  styleUrl: './sub-navbar-usuario.css',
})
export class SubNavbarUsuario {
    usuarioLogueado: Usuario| null = null ;
    errorCarga: string | null = null;
    private router = inject(Router);
    private comunidadService = inject(ComunidadService);
    private usuarioService: UsuarioService = inject(UsuarioService);
    usuarioId: number = 0;

    rol: string = "";
    pertenece: boolean = false;

    ngOnInit(){
        this.usuarioService.getMiPerfil().subscribe({
            next: (data) => {
                this.usuarioLogueado = data;
                localStorage.setItem('idUsuario', String(data.usuarioId))
                this.usuarioId = data.usuarioId
                console.log("ID guardado:", this.usuarioId);

                this.rol = localStorage.getItem('rol') ?? "";
                console.log("ROL DETECTADO:", this.rol);

                this.comunidadService.verificarPertenencia(this.usuarioId)
                    .subscribe(resp => {
                        this.pertenece = resp.pertenece;
                        console.log("¿Pertenece a una comunidad?", this.pertenece);
                    });
            },
            error: (err) => {
                this.errorCarga =
                    'No se guardar el Id para el SubNavBar';
            },
        });
    }

    perteneceAComunidad(): boolean {
        return this.pertenece;
    }

    isModerador(): boolean {
        return this.rol === 'MODERADOR';
    }

    isCliente(): boolean {
        return this.rol === 'CLIENTE';
    }

    irPerfil() {
        this.router.navigate(['/editar-perfil']);
    }

    cerrarSesion() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }
}

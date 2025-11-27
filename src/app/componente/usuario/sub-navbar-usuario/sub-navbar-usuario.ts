import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-sub-navbar-usuario',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sub-navbar-usuario.html',
  styleUrl: './sub-navbar-usuario.css',
})
export class SubNavbarUsuario {
    private router = inject(Router);
    rol: string = "";

    irPerfil() {
        this.router.navigate(['/editar-perfil']);
    }

    cerrarSesion() {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }

    ngOnInit(){
        this.rol = localStorage.getItem('rol') ?? "";
        console.log("ROL DETECTADO:", this.rol);

    }

    isModerador(): boolean {
        return this.rol === 'MODERADOR';
    }

    isCliente(): boolean {
        return this.rol === 'CLIENTE';
    }
}

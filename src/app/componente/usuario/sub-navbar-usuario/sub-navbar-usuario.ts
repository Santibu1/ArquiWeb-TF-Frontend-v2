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

    irPerfil() {
        this.router.navigate(['/usuario/perfil']);
    }

    cerrarSesion() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

}

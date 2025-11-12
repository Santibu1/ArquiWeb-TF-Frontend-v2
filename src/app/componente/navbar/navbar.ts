import {Component, inject} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule,MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
    router: Router = inject(Router);
    rol: any;
    esAdministrador(): boolean {
        let es = false;
        this.rol = localStorage.getItem('rol');
        if (this.rol === 'ROLE_ADMINISTRADOR') es = true;
        return es;
    }
    esCliente(): boolean {
        let es = false;
        this.rol = localStorage.getItem('rol');
        if (this.rol === 'ROLE_CLIENTE') es = true;
        return es;
    }
    esModerador(): boolean {
        let es = false;
        this.rol = localStorage.getItem('rol');
        if (this.rol === 'ROLE_MODERADOR') es = true;
        return es;
    }

}

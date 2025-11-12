import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule, NavigationEnd} from "@angular/router";
import {CommonModule} from "@angular/common";
import {filter} from "rxjs/operators";
import {MatIconModule} from "@angular/material/icon";
@Component({
  selector: 'app-menu-administrador',
    standalone: true,
  imports: [CommonModule,
      RouterLink,
      RouterModule,
      RouterLinkActive,MatIconModule],
  templateUrl: './menu-administrador.html',
  styleUrl: './menu-administrador.css',
})
export class MenuAdministrador {
    mostrarDashboard = true;

    constructor(private router: Router) {
        // Detectar cambios de ruta para mostrar/ocultar el dashboard
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            // Mostrar dashboard solo cuando estamos exactamente en /admin
            this.mostrarDashboard = event.url === '/admin' || event.url === '/admin/';
        });
    }
}

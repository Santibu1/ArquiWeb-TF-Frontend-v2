import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule, NavigationEnd} from "@angular/router";
import {CommonModule} from "@angular/common";
import {filter} from "rxjs/operators";
import {MatIconModule} from "@angular/material/icon";
import {Usuario} from "../../../model/usuario";
import {UsuarioService} from "../../../services/usuario-service";
@Component({
  selector: 'app-menu-administrador',
    standalone: true,
  imports: [CommonModule,
      RouterLink,
      RouterModule,
      MatIconModule],
  templateUrl: './menu-administrador.html',
  styleUrl: './menu-administrador.css',
})
export class MenuAdministrador {
    mostrarDashboard = true;

    private usuarioService: UsuarioService = inject(UsuarioService);

    constructor(private router: Router) {
        // Detectar cambios de ruta para mostrar/ocultar el dashboard
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            // Mostrar dashboard solo cuando estamos exactamente en /admin
            this.mostrarDashboard = event.url === '/admin' || event.urlAfterRedirects  === '/admin/';
        });
    }

    ngOnInit(): void {
        this.usuarioService.getMiPerfil().subscribe({
            next: (data) => {
                localStorage.setItem('idUsuario', String(data.usuarioId))
                console.log('ID guardado en localStorage:', localStorage.getItem('idUsuario'));
            },
            error: (err) => {
                console.error('Error al cargar el perfil del usuario:', err);
            },
        });
    }
}

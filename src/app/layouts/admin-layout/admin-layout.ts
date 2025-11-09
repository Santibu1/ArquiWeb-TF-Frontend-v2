import { Component } from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-admin-layout',
    standalone: true,
  imports: [
      RouterModule,
      MatIconModule// <-- ¡AÑADE ESTO! (para router-outlet)
      ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
    constructor(private router: Router) {}

    cerrarSesion() {
        // Aquí irá tu lógica de cierre de sesión
        // Por ahora, simplemente redirige al login
        this.router.navigate(['/auth/login']);
    }
}

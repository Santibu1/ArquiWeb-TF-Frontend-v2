import {Component, inject, OnInit} from '@angular/core';
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {Usuario} from "../../../model/usuario";
import {UsuarioService} from "../../../services/usuario-service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home-usuario',
    standalone: true,
  imports: [CommonModule,SubNavbarUsuario],
  templateUrl: './home-usuario.html',
  styleUrl: './home-usuario.css',
})
export class HomeUsuario implements OnInit {
// Variable para guardar los datos del usuario. Inicia como nula.
    usuarioLogueado: Usuario| null = null ;
    errorCarga: string | null = null;

    // Inyectamos el servicio
    private usuarioService: UsuarioService = inject(UsuarioService);

    // ngOnInit se ejecuta cuando el componente se inicia
    ngOnInit(): void {
        // Llamamos al servicio para obtener el perfil del usuario
        this.usuarioService.getMiPerfil().subscribe({
            next: (data) => {
                // Si todo sale bien, guardamos los datos en nuestra variable
                this.usuarioLogueado = data;
                console.log('Usuario cargado:', this.usuarioLogueado);
                localStorage.setItem('idUsuario', String(data.usuarioId))
                console.log('ID guardado en localStorage:', localStorage.getItem('idUsuario'));
            },
            error: (err) => {
                // Si hay un error, lo registramos y mostramos un mensaje
                console.error('Error al cargar el perfil del usuario:', err);
                this.errorCarga =
                    'No se pudo cargar tu perfil. Intenta recargar la página.';
            },
        });
    }
}

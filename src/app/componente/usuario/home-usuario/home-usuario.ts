import {Component, inject, OnInit} from '@angular/core';
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {Usuario} from "../../../model/usuario";
import {UsuarioService} from "../../../services/usuario-service";
import {CommonModule} from "@angular/common";
import {EcoChatService} from "../../../services/eco-chat-service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home-usuario',
    standalone: true,
    imports: [CommonModule,SubNavbarUsuario],
    templateUrl: './home-usuario.html',
    styleUrl: './home-usuario.css',
})
export class HomeUsuario implements OnInit {
    private router = inject(Router);
// --- VARIABLES ---
    usuarioLogueado: Usuario | null = null;
    errorCarga: string | null = null;

    ecoTip: string = "Cargando eco-consejo...";
    cargandoEcoTip: boolean = true;

    // --- SERVICIOS ---
    private usuarioService = inject(UsuarioService);
    private ecoChat = inject(EcoChatService);

    // --- INICIO ---
    ngOnInit(): void {
        this.cargarPerfil();
        this.cargarEcoTip();
    }

    // --- PERFIL DEL USUARIO ---
    cargarPerfil() {
        this.usuarioService.getMiPerfil().subscribe({
            next: (data) => {
                this.usuarioLogueado = data;
                console.log("Usuario cargado:", data);
                localStorage.setItem('idUsuario', String(data.usuarioId));
            },
            error: (err) => {
                console.error("Error al cargar perfil:", err);
                this.errorCarga = "No se pudo cargar tu perfil. Intenta recargar la página.";
            }
        });
    }

    // --- ECO TIP ---
    cargarEcoTip() {
        this.cargandoEcoTip = true;

        this.ecoChat.obtenerEcoTip().subscribe({
            next: (tip) => {
                this.ecoTip = tip;
                this.cargandoEcoTip = false;
            },
            error: (err) => {
                console.error("Error EcoTip:", err);
                this.ecoTip = "No se pudo cargar tu eco-consejo hoy 🌱";
                this.cargandoEcoTip = false;
            }
        });
    }
    irASuscripcion() {
        this.router.navigate(['usuario/suscripcion']);
    }
}

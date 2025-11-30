import {Component, inject, OnInit} from '@angular/core';
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {Usuario} from "../../../model/usuario";
import {UsuarioService} from "../../../services/usuario-service";
import {CommonModule} from "@angular/common";
import {EcoChatService} from "../../../services/eco-chat-service";
import {Router} from "@angular/router";
import {UsuarioPlan} from "../../../model/usuario-plan";

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
    // ESTADO DEL PLAN
    planActivo: boolean | null = null;   // null = no mostrar nada
    diasRestantes: number = 0;
    fechaInicio: string | null = null;
    fechaFin: string | null = null;

    ecoTip: string = "Cargando eco-consejo...";
    cargandoEcoTip: boolean = true;

    // --- SERVICIOS ---
    private usuarioService = inject(UsuarioService);
    private ecoChat = inject(EcoChatService);

    // --- INICIO ---
    ngOnInit(): void {
        this.cargarPerfil();
        this.cargarEcoTip();
        this.cargarEstado();
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
    cargarEstado(){
        this.usuarioService.getMiPlan().subscribe({
            next: (data: UsuarioPlan) => {

                this.fechaInicio = data.fechaInicioPlan;
                this.fechaFin = data.fechaFinPlan;
                this.diasRestantes = data.diasRestantes;

                // Caso 1: No tiene plan → NO mostrar nada
                if (!data.planId || !data.fechaInicioPlan || !data.fechaFinPlan) {
                    this.planActivo = null;
                    return;
                }

                // Caso 2: Plan activo
                if (data.diasRestantes > 0) {
                    this.planActivo = true;
                    return;
                }

                // Caso 3: Plan expirado (0 o negativo)
                this.planActivo = false;

                console.log("Plan cargado:", data);
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

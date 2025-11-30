import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { SubNavbarUsuario } from "../sub-navbar-usuario/sub-navbar-usuario";
import { Usuario } from "../../../model/usuario";
import { UsuarioService } from "../../../services/usuario-service";

@Component({
    selector: 'app-suscripcion-plin',
    standalone: true,
    templateUrl: './suscripcion-plin.html',
    styleUrl: './suscripcion-plin.css',
    imports: [
        CommonModule,
        NgIf,
        FormsModule,
        SubNavbarUsuario,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class SuscripcionPlin {

    usuarioLogueado: Usuario | null = null;
    planId: number | null = null;

    tarjeta: string = "";
    celular: string = "";

    private usuarioService = inject(UsuarioService);
    private router = inject(Router);

    ngOnInit(): void {

        this.usuarioService.getMiPerfil().subscribe({
            next: (data) => this.usuarioLogueado = data
        });

        this.planId = Number(localStorage.getItem("planIdSeleccionado"));

        if (!this.planId || this.planId === 0) {
            alert("Debes seleccionar un plan antes de continuar.");
            this.router.navigate(['/usuario/suscripcion']);
        }
    }

    volver() {
        this.router.navigate(['/usuario/suscripcion']);
    }

    soloNumeros(event: any) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    validarCelular(): boolean {
        return /^9\d{8}$/.test(this.celular);
    }

    validarTarjeta(): boolean {
        return /^\d{16}$/.test(this.tarjeta);
    }

    registrar() {

        if (!this.validarTarjeta()) {
            alert("La tarjeta debe tener 16 dígitos.");
            return;
        }

        if (!this.validarCelular()) {
            alert("El número de celular debe iniciar con 9 y tener 9 dígitos.");
            return;
        }

        this.usuarioService.asignarPlan(
            this.usuarioLogueado!.usuarioId!,
            this.planId!
        ).subscribe({
            next: () => {
                alert("¡Suscripción registrada correctamente!");
                this.router.navigate(['/usuario/home']);
            },
            error: () => alert("Error al registrar la suscripción")
        });
    }
}



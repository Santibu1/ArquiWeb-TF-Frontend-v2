import { Component, inject } from '@angular/core';
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";

import { SubNavbarUsuario } from "../sub-navbar-usuario/sub-navbar-usuario";
import { Usuario } from "../../../model/usuario";
import { UsuarioService } from "../../../services/usuario-service";

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-suscripcion-bcp',
    standalone: true,
    templateUrl: './suscripcion-bcp.html',
    styleUrl: './suscripcion-bcp.css',
    imports: [
        NgIf,
        FormsModule,
        SubNavbarUsuario,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class SuscripcionBcp {

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


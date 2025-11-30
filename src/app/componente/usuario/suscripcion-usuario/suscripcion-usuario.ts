import { Component, inject } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SubNavbarUsuario } from "../sub-navbar-usuario/sub-navbar-usuario";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {CommonModule} from "@angular/common";
import { Router } from "@angular/router";
import {PlanService} from "../../../services/plan-service";
import {SuscripcionBcp} from "../suscripcion-bcp/suscripcion-bcp";

@Component({
    selector: 'app-suscripcion-usuario',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        SubNavbarUsuario,
        ReactiveFormsModule
    ],
    templateUrl: './suscripcion-usuario.html',
    styleUrl: './suscripcion-usuario.css',
})
export class SuscripcionUsuario {
    private planService= inject(PlanService);
    fb = inject(FormBuilder);
    router = inject(Router);

    mostrarFormulario = false;
    planSeleccionado: string = "";
    imagenMetodo: string | null = null;

    form: FormGroup = this.fb.group({
        metodo: ['']
    });
    seleccionarPlan(nombre: string, id: number) {
        this.planSeleccionado = nombre;
        this.mostrarFormulario = true;

        localStorage.setItem("planIdSeleccionado", String(id));
        localStorage.setItem("planNombreSeleccionado", nombre);

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }


    actualizarImagen() {
        const metodo = this.form.value.metodo;

        if (metodo === "YAPE-BCP") {
            this.imagenMetodo = "images/logos/YAPE-BCP.png";
        } else if (metodo === "PLIN-INTERBANK") {
            this.imagenMetodo = "images/logos/PLIN-INTERBANK.png";
        }
    }
    confirmar() {
        const metodo = this.form.value.metodo;

        if (!metodo) {
            alert("Selecciona un método de pago.");
            return;
        }

        // NAVEGAR SEGÚN MeTODO SELECCIONADO
        if (metodo === "YAPE-BCP") {
            this.router.navigate(['/usuario/suscripcion-bcp']);
        }
        if (metodo === "PLIN-INTERBANK") {
            this.router.navigate(['/usuario/suscripcion-plin']);
        }
    }

    cancelar() {
        this.mostrarFormulario = false;
        this.form.reset();
        this.imagenMetodo = null;
    }
}



import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterModule, Router} from "@angular/router";
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button"; // <-- ¡AÑADE ESTE!

@Component({
    selector: 'app-login',
    standalone: true, // <-- ¡ASEGÚRATE DE ESTO!
    imports: [
        CommonModule, // <-- ¡NECESARIO PARA *ngIf!
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule

    ],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    fb: FormBuilder = inject(FormBuilder);
    loginForm: FormGroup;

    // --- 2. INYECTA EL ROUTER AQUÍ ---
    router: Router = inject(Router);

    constructor() {
        this.loginForm = this.fb.group({
            correo: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Login data:', this.loginForm.value);

            // --- 3. ¡AQUÍ ESTÁ LA SIMULACIÓN! ---
            // Como es un mockup, no llamamos al servicio.
            // Simplemente navegamos a la página de inicio del usuario.
            this.router.navigate(['/usuario/inicio']);
        }
    }
}

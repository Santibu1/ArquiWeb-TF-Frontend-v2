import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from '@angular/material/select';

import { RegisterService } from '../../services/register-service';

@Component({
    selector: 'app-register-component',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule
    ],
    templateUrl: './register-component.html',
    styleUrl: './register-component.css'
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);
    registerService = inject(RegisterService);

    // Variable para controlar qué vista se muestra
    selectedRole: 'CLIENTE' | 'MODERADOR' | null = null;

    ngOnInit(): void {
        // El formulario se creará cuando el usuario seleccione un rol
    }

    // Función para seleccionar el rol
    selectRole(role: 'CLIENTE' | 'MODERADOR'): void {
        this.selectedRole = role;

        // Crear el formulario con el rol seleccionado
        this.registerForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(2)]],
            apellido: ['', [Validators.required, Validators.minLength(2)]],
            // --- CAMPO AÑADIDO AL FORMULARIO ---
            edad: ['', [Validators.required, Validators.min(18)]], // Asumimos 18+
            email: ['', [Validators.required, Validators.email]],

            // --- CAMBIO 1: Inicializado en 0 (como pediste) ---
            ecobits: [0], // Ya no es 10

            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
            role: [this.selectedRole, [Validators.required]] // Rol se añade al formulario
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // Volver a la pantalla de selección de rol
    goBackToRoleSelection(): void {
        this.selectedRole = null;
        if (this.registerForm) {
            this.registerForm.reset();
        }
    }

    // --- FUNCIÓN AÑADIDA ---
    // Esta función faltaba y la llama tu HTML
    navigateToLogin(): void {
        this.router.navigate(['/login']);
    }

    // Validador personalizado para verificar que las contraseñas coincidan
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (password !== confirmPassword) {
            control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            // Limpia el error si las contraseñas coinciden
            const errors = control.get('confirmPassword')?.errors;
            if (errors && errors['passwordMismatch']) {
                delete errors['passwordMismatch'];
                if (Object.keys(errors).length === 0) {
                    control.get('confirmPassword')?.setErrors(null);
                }
            }
            return null;
        }
    }

    // Método para enviar el formulario
    onRegisterSubmit(): void {
        this.registerForm.markAllAsTouched();

        if (this.registerForm.invalid) {
            console.log('Formulario inválido');
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        // Mapear los datos al formato que espera el backend
        const dataToSend = {
            nombreUsuario: this.registerForm.value.nombre,
            apellidoUsuario: this.registerForm.value.apellido,
            emailUsuario: this.registerForm.value.email,
            passwordUsuario: this.registerForm.value.password,
            // --- CAMPO AÑADIDO AL ENVÍO ---
            edadUsuario: parseInt(this.registerForm.value.edad), // Convertir a número

            // --- CAMBIO 2: Añadido al objeto que se envía ---
            // (Asumo que el backend espera 'ecobits'. Si espera 'ecobitsUsuario', cámbialo)
            ecobits: this.registerForm.value.ecobits,

            rolId: this.registerForm.value.role === 'CLIENTE' ? 3 : 2  // Ajusta estos IDs según tu BD
        };

        console.log('Datos a enviar al backend:', dataToSend);

        this.registerService.register(dataToSend).subscribe({
            next: (response) => {
                console.log('Registro exitoso!', response);
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                console.error('Error completo:', err);
                console.error('Detalles del error:', err.error);

                let errorMessage = 'Error al registrar. ';

                if (err.status === 0) {
                    errorMessage += 'No se puede conectar con el servidor.';
                } else if (err.status === 400) {
                    if (err.error && typeof err.error === 'object') {
                        errorMessage += JSON.stringify(err.error);
                    } else {
                        errorMessage += 'Datos inválidos.';
                    }
                } else if (err.status === 409) {
                    errorMessage += 'El correo ya está registrado.';
                } else {
                    errorMessage += 'Por favor, intenta de nuevo.';
                }

                alert(errorMessage);
            }
        });
    }
}
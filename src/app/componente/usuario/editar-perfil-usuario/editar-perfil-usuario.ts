import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {UsuarioService} from "../../../services/usuario-service";
import { Usuario } from "../../../model/usuario";
import { Router } from '@angular/router';
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-editar-perfil-usuario',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './editar-perfil-usuario.html',
    styleUrl: './editar-perfil-usuario.css'
})
export class EditarPerfilUsuarioComponent implements OnInit {
    private usuarioService = inject(UsuarioService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    perfilForm!: FormGroup;
    usuario: Usuario | null = null;
    isLoading = false;
    errorMessage = '';
    successMessage = '';
    mostrarPassword = false;

    ngOnInit(): void {
        console.log('🎯 Componente de perfil cargado');
        this.verificarAutenticacion();
        this.inicializarFormulario();
        this.cargarPerfil();
    }

    verificarAutenticacion(): void {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            console.error('No hay token de autenticación');
            this.errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 2000);
        } else {
            console.log('✅ Token encontrado');
        }
    }

    inicializarFormulario(): void {
        this.perfilForm = this.fb.group({
            nombreUsuario: ['', [Validators.required, Validators.minLength(2)]],
            apellidoUsuario: ['', [Validators.required, Validators.minLength(2)]],
            emailUsuario: ['', [Validators.required, Validators.email]],
            edadUsuario: ['', [Validators.required, Validators.min(13), Validators.max(120)]],
            passwordUsuario: ['', [Validators.minLength(6)]],
            confirmarPasswordUsuario: ['']
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // Validador para verificar que las contraseñas coincidan
    passwordMatchValidator(control: any): { [key: string]: boolean } | null {
        const password = control.get('passwordUsuario')?.value;
        const confirmPassword = control.get('confirmarPasswordUsuario')?.value;

        // Solo validar si se ha ingresado una contraseña
        if (password && password !== confirmPassword) {
            control.get('confirmarPasswordUsuario')?.setErrors({passwordMismatch: true});
            return {passwordMismatch: true};
        } else {
            // Limpiar error si coinciden
            const errors = control.get('confirmarPasswordUsuario')?.errors;
            if (errors && errors['passwordMismatch']) {
                delete errors['passwordMismatch'];
                if (Object.keys(errors).length === 0) {
                    control.get('confirmarPasswordUsuario')?.setErrors(null);
                }
            }
            return null;
        }
    }

    cargarPerfil(): void {
        this.isLoading = true;
        this.errorMessage = '';

        console.log('📡 Cargando perfil del usuario...');

        this.usuarioService.getMiPerfil().subscribe({
            next: (usuario: Usuario) => {
                console.log('✅ Perfil cargado:', usuario);
                this.usuario = usuario;
                this.perfilForm.patchValue({
                    nombreUsuario: usuario.nombreUsuario,
                    apellidoUsuario: usuario.apellidoUsuario,
                    emailUsuario: usuario.emailUsuario,
                    edadUsuario: usuario.edadUsuario
                });
                this.isLoading = false;
            },
            error: (error) => {
                console.error(' Error al cargar perfil:', error);

                if (error.status === 401) {
                    this.errorMessage = 'Sesión expirada. Redirigiendo al login...';
                    setTimeout(() => {
                        localStorage.clear();
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }, 2000);
                } else if (error.status === 403) {
                    this.errorMessage = 'No tienes permisos para acceder a esta sección.';
                } else {
                    this.errorMessage = 'No se pudo cargar tu perfil. Por favor, intenta nuevamente.';
                }

                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.perfilForm.invalid || !this.usuario) {
            this.marcarCamposComoTocados();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const usuarioActualizado: Usuario = {
            ...this.usuario,
            nombreUsuario: this.perfilForm.value.nombreUsuario,
            apellidoUsuario: this.perfilForm.value.apellidoUsuario,
            emailUsuario: this.perfilForm.value.emailUsuario,
            edadUsuario: this.perfilForm.value.edadUsuario
        };

        // Solo agregar password si se ingresó uno nuevo
        if (this.perfilForm.value.passwordUsuario && this.perfilForm.value.passwordUsuario.trim() !== '') {
            usuarioActualizado.passwordUsuario = this.perfilForm.value.passwordUsuario;
        }

        console.log('📤 Actualizando perfil...', usuarioActualizado);

        this.usuarioService.update(this.usuario.usuarioId, usuarioActualizado).subscribe({
            next: (usuarioActualizado) => {
                console.log('✅ Perfil actualizado exitosamente');
                this.successMessage = '¡Perfil actualizado exitosamente!';
                this.usuario = usuarioActualizado;
                this.perfilForm.get('passwordUsuario')?.reset();
                this.isLoading = false;

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    this.router.navigate(['/usuario/home']);
                }, 2000);
            },
            error: (error) => {
                console.error('Error al actualizar perfil:', error);

                if (error.status === 401) {
                    this.errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
                } else if (error.status === 403) {
                    this.errorMessage = 'No tienes permisos para realizar esta acción.';
                } else {
                    this.errorMessage = error.error?.message || 'No se pudo actualizar el perfil. Verifica los datos e intenta nuevamente.';
                }

                this.isLoading = false;
            }
        });
    }

    marcarCamposComoTocados(): void {
        Object.keys(this.perfilForm.controls).forEach(key => {
            this.perfilForm.get(key)?.markAsTouched();
        });
    }

    toggleMostrarPassword(): void {
        this.mostrarPassword = !this.mostrarPassword;
    }

    cancelar(): void {
        this.router.navigate(['/usuario/home']);
    }

    // Métodos de validación para el template
    campoEsInvalido(campo: string): boolean {
        const control = this.perfilForm.get(campo);
        return !!(control && control.invalid && control.touched);
    }

    obtenerMensajeError(campo: string): string {
        const control = this.perfilForm.get(campo);

        if (!control || !control.errors) return '';

        if (control.errors['required']) {
            return 'Este campo es requerido';
        }
        if (control.errors['email']) {
            return 'Email inválido';
        }
        if (control.errors['minlength']) {
            const minLength = control.errors['minlength'].requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }
        if (control.errors['min']) {
            return `La edad mínima es ${control.errors['min'].min}`;
        }
        if (control.errors['max']) {
            return `La edad máxima es ${control.errors['max'].max}`;
        }

        return 'Campo inválido';
    }
}
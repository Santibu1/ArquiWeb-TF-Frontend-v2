import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from "../../services/login-service";
import {RequestDto} from "../../model/request-dto";
import {ResponseDto} from "../../model/response-dto";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

@Component({
    selector: 'app-login-component',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './login-component.html',
    styleUrl: './login-component.css',
})
export class LoginComponent {
    loginForm: FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);
    loginService = inject(LoginService);
    snackBar = inject(MatSnackBar)
    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    ngOnInit() {
        if (localStorage.getItem('token')) {
            localStorage.clear(); // borra todos los items
            console.log("Token e items eliminados");
        }
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const requestDto = new RequestDto();
            requestDto.email = this.loginForm.value.email;
            requestDto.password = this.loginForm.value.password;

            this.loginService.login(requestDto).subscribe({
                next: (data: ResponseDto) => {
                    // Guarda el token
                    const token = localStorage.getItem('token');
                    console.log("Token almacenado:", token);

                    // Extrae el rol y elimina "ROLE_" si existe
                    const rolRaw = data.roles[0] || '';
                    const rol = rolRaw.replace('ROLE_', '');
                    localStorage.setItem('rol', rol);

                    localStorage.setItem('guard', rol);

                    // Navegación según rol
                    if (rol === 'ADMINISTRADOR') {
                        this.router.navigate(['/admin']);
                    } else if (rol === 'CLIENTE' || rol === 'MODERADOR') {
                        this.router.navigate(['/usuario/home']);
                    } else {
                        this.router.navigate(['/login']); // fallback
                    }
                },
                error: (error: any) => {
                    console.error("Error login:", error);

                    let mensajeFinal: string = "";

                    if (error.status === 0) {
                        // Error de red o servidor apagado
                        mensajeFinal = "No se pudo conectar con el servidor. Verifica que el backend esté activo.";
                    }
                    // Intenta extraer el mensaje del cuerpo del error (si es JSON o tiene 'message')
                    else if (error.error && typeof error.error === 'object' && (error.error.mensaje || error.error.message)) {
                        mensajeFinal = error.error.mensaje || error.error.message;
                    }
                    // Si el error es un string simple (ej: "Usuario suspendido")
                    else if (typeof error.error === "string" && error.error.length > 0) {
                        mensajeFinal = error.error;
                    }
                    // Manejo específico del 403
                    else if (error.status === 403 || error.status === 401) {
                        // Este es el fallback para el 403 sin cuerpo de mensaje útil
                        mensajeFinal = "Acceso denegado. Es posible que el servidor no haya autorizado la solicitud por mala conducta";
                    }
                    else {
                        mensajeFinal = "Error desconocido durante el inicio de sesión. Inténtalo de nuevo.";
                    }
                    console.log("Mensaje final a mostrar:", mensajeFinal);

                    // Muestra el mensaje usando MatSnackBar en lugar de alert()
                    this.snackBar.open(mensajeFinal, 'CERRAR', {
                        duration: 7000, // 7 segundos de duración
                        panelClass: ['snackbar-error']
                    });
                }

            });
        } else {
            alert("Formulario no válido!");
            this.loginForm.markAllAsTouched();
        }
    }

    navigateToRegister(): void {
        this.router.navigate(['/registro']);
    }
}

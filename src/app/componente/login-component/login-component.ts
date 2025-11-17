import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from "../../services/login-service";
import { RequestDto } from "../../model/request-dto";
import { ResponseDto } from "../../model/response-dto";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

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
        MatIconModule
    ],
    templateUrl: './login-component.html',
    styleUrl: './login-component.css',
})
export class LoginComponent {
    loginForm: FormGroup;
    fb = inject(FormBuilder);
    router = inject(Router);
    loginService = inject(LoginService);

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
                    alert('Credenciales inválidas');
                }
            });
        } else {
            alert("Formulario no válido!");
            this.loginForm.markAllAsTouched();
        }
    }
}

import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-registro',
    standalone: true,
  imports: [
      ReactiveFormsModule,
      RouterModule,
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
    fb: FormBuilder = inject(FormBuilder);
    registroForm: FormGroup;

    constructor() {
        this.registroForm = this.fb.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repetirPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }
    // Validador personalizado para verificar que las contraseñas coincidan
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const repetirPassword = form.get('repetirPassword')?.value;
        return password === repetirPassword ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registroForm.valid) {
            console.log('Datos de registro:', this.registroForm.value);
            // Aquí iría la llamada al AuthService para registrar al usuario
            // this.authService.register(this.registroForm.value).subscribe(...)
        } else {
            console.log('Formulario de registro inválido.');
        }
    }

}

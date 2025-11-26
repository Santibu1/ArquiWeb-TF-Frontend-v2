import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-suscripcion-metodo-pago',
    standalone: true,
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        CommonModule
    ],
    templateUrl: './suscripcion-metodo-pago.html',
    styleUrl: './suscripcion-metodo-pago.css',
})
export class SuscripcionMetodoPago {

    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }

    seleccionarMetodo(metodo: string): void {
        console.log('Método de pago seleccionado:', metodo);
        alert(`Redirigiendo para procesar pago con ${metodo}...`);
    }
}

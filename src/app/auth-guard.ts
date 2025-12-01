import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private route: Router) {
    }

    canActivate(): boolean {
        const usuarioAuenticado = localStorage.getItem('guard');

        if (usuarioAuenticado) {
            console.log("Funciona el Guard");
            return true;
        } else {
            this.route.navigate(['/login']);
            return false;
        }
    }
}

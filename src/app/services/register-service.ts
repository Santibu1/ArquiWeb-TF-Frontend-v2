import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private url = environment.apiUrl;
    private http = inject(HttpClient);

    register(userData: any): Observable<any> {
        // QUITA el /api del principio
        return this.http.post(`${this.url}/usuarios/registrarUsuario`, userData);
    }
}
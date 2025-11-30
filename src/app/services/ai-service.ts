import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private http = inject(HttpClient);
    // Apunta a tu controlador Java
    private apiUrl = `${environment.apiUrl}/ai/recomendar`;

    // 1. Obtener Análisis
    obtenerAnalisis(datosGrafico: string): Observable<string> {
        // IMPORTANTE: { responseType: 'text' } evita que Angular intente leerlo como JSON
        return this.http.post(this.apiUrl, { datos: datosGrafico }, { responseType: 'text' });
    }

    // 2. Texto a Voz (Nativo)
    leerTexto(texto: string) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Detener audio anterior
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'es-ES';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Tu navegador no soporta lectura de voz.");
        }
    }
}
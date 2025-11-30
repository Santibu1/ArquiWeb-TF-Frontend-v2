import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class EcoChatService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/chatbot/eco-tip`;

    obtenerEcoTip(): Observable<string> {
        return this.http.get(this.apiUrl, { responseType: 'text' });
    }
}

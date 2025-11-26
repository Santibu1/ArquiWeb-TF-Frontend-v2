import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-suscripcion-usuario',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        SubNavbarUsuario,
        RouterLink
    ],
  templateUrl: './suscripcion-usuario.html',
  styleUrl: './suscripcion-usuario.css',
})
export class SuscripcionUsuario {

}

import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-menu-administrador',
  imports: [CommonModule,
      RouterLink,
      RouterLinkActive],
  templateUrl: './menu-administrador.html',
  styleUrl: './menu-administrador.css',
})
export class MenuAdministrador {

}

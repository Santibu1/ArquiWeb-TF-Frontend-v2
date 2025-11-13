import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'app-footer',
    standalone: true, // <-- ¡ESTA LÍNEA ES LA QUE FALTA!
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule, // <-- Solo si lo usas en el footer
        MatButtonModule,  // <-- Solo si lo usas en el footer
        MatIconModule     // <-- Solo si lo usas en el footer
    ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
}

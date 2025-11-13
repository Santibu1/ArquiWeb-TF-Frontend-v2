import { Component, signal } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Navbar} from "./componente/navbar/navbar";
import {Footer} from "./componente/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EcoChips');
}

import {Component, inject} from '@angular/core';
import {ActividadService} from "../../../services/actividad-service";
import {UsuarioActividadService} from "../../../services/usuario-actividad-service";
import {UsuarioService} from "../../../services/usuario-service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {Actividad} from "../../../model/actividad";
import {Usuario} from "../../../model/usuario";
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@Component({
  selector: 'app-listar-actividades-user',
    imports: [
        SubNavbarUsuario,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule, // <-- Agrega este
        MatSnackBarModule
    ],
  templateUrl: './listar-actividades-user.html',
  styleUrl: './listar-actividades-user.css',
})
export class ListarActividadesUser {
    private actividadService = inject(ActividadService);
    private usuarioActividadService = inject(UsuarioActividadService);
    private usuarioService = inject(UsuarioService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog); // Para modal de confirmación si lo usas

    // Variables de estado
    actividades: Actividad[] = [];
    actividadesCompletadasIds: Set<number> = new Set(); // Usamos Set para búsqueda rápida O(1)
    usuarioActual: Usuario | null = null;
    loading = true;

    ngOnInit(): void {
        this.cargarDatosIniciales();
    }

    cargarDatosIniciales() {
        this.loading = true;
        // 1. Obtener perfil del usuario logueado para tener su ID
        this.usuarioService.getMiPerfil().subscribe({
            next: (user) => {
                this.usuarioActual = user;
                this.cargarActividades();
            },
            error: (err) => {
                console.error('Error al obtener perfil', err);
                this.loading = false;
            }
        });
    }

    cargarActividades() {
        // 2. Cargar todas las actividades del sistema
        this.actividadService.list().subscribe({
            next: (data) => {
                // Filtramos solo las actividades activas, tal como indica tu regla de negocio
                this.actividades = data.filter(a => a.estadoActividad === 'Activa');

                // 3. Una vez tenemos las actividades y el usuario, cargamos su historial
                if (this.usuarioActual) {
                    this.cargarHistorialUsuario(this.usuarioActual.usuarioId);
                }
            },
            error: (err) => console.error('Error listando actividades', err)
        });
    }

    cargarHistorialUsuario(usuarioId: number) {
        this.usuarioActividadService.listarActividadesPorUsuario(usuarioId).subscribe({
            next: (historial) => {
                // Guardamos los IDs de actividades completadas en un Set
                this.actividadesCompletadasIds = new Set(historial.map(h => h.actividadId));
                this.loading = false;
            },
            error: (err) => {
                console.error('Error cargando historial', err);
                this.loading = false;
            }
        });
    }

    // Método para verificar en el HTML si una actividad ya fue hecha
    isCompletada(actividadId: number): boolean {
        return this.actividadesCompletadasIds.has(actividadId);
    }

    onCompletarActividad(actividad: Actividad) {
        if (!this.usuarioActual) return;

        // Validación visual por seguridad
        if (this.isCompletada(actividad.actividadId!)) {
            this.snackBar.open('¡Ya completaste esta actividad hoy!', 'Cerrar', { duration: 3000 });
            return;
        }

        // Confirmación simple (puedes cambiarlo por tu Modal Dialog)
        if (confirm(`¿Confirmas que realizaste: ${actividad.nombreActividad}?`)) {

            this.usuarioActividadService.completarActividad(this.usuarioActual.usuarioId, actividad.actividadId!)
                .subscribe({
                    next: (res) => {
                        // 1. Feedback visual: Agregamos al Set para que se ponga gris/check verde
                        this.actividadesCompletadasIds.add(actividad.actividadId!);

                        // 2. Notificación
                        this.snackBar.open(`¡Genial! Ganaste puntos por: ${actividad.nombreActividad}`, 'OK', {
                            duration: 4000,
                            panelClass: ['success-snackbar'] // Asegúrate de tener estilo para esto
                        });

                        // 3. ACTUALIZACIÓN CRÍTICA:
                        // Como el backend sumó puntos (y quizas bonus por plan),
                        // debemos recargar el usuario en el servicio o notificar al componente padre (Home)
                        // Opción rápida: Recargar página o usar un Subject en UsuarioService para actualizar el nav.
                        // Por ahora, imprimimos en consola el nuevo estado.
                        console.log('Actividad registrada:', res);
                    },
                    error: (err) => {
                        console.error(err);
                        this.snackBar.open('Error al registrar actividad.', 'Cerrar', { duration: 3000 });
                    }
                });
        }
    }
}

import { Routes } from '@angular/router';

// --- 1. IMPORTA LOS 3 LAYOUTS ---
import {AuthLayout} from "./layouts/auth-layout/auth-layout";
import {UserLayout} from "./layouts/user-layout/user-layout";
import {AdminLayout} from "./layouts/admin-layout/admin-layout";


// --- 2. IMPORTA LAS PÁGINAS DE CADA CARPETA NUEVA ---

// AUTH
import {Login} from "./componente/auth/login/login";
import {Registro} from "./componente/auth/registro/registro";

// USUARIO (CLIENTE)
import {HomeUsuario} from "./componente/usuario/home-usuario/home-usuario";
// Mueve tus componentes (Inicio, Comunidad, etc.) a la carpeta 'componente/usuario/'
// y actualiza estas rutas. 'home-usuario' es tu nuevo 'inicio'.
// import { ComunidadComponent } from './componente/usuario/comunidad/comunidad.component';
// import { CanjearComponent } from './componente/usuario/canjear/canjear.component';
// ...etc

// ADMINISTRADOR
import {
    ActividadesListarAdministradorComponent
} from "./componente/administrador/actividades-listar-administrador/actividades-listar-administrador";
import {
    ActividadesNuevoEditAdministradorComponent
} from "./componente/administrador/actividades-nuevo-edit-administrador/actividades-nuevo-edit-administrador";
import {
    ReportesListarAdministradorComponent
} from "./componente/administrador/reportes-listar-administrador/reportes-listar-administrador";
import {MenuAdministrador} from "./componente/administrador/menu-administrador/menu-administrador";




// ...etc

export const routes: Routes = [
    // --- Rutas de Autenticación (sin header/footer) ---
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            { path: 'login', component:  Login},
            { path: 'registro', component: Registro },
        ]
    },

    // --- Rutas de Cliente (con header/footer de cliente) ---
    {
        path: 'usuario', // Prefijo para todas las rutas de cliente
        component: UserLayout, // Carga la plantilla de cliente
        // canActivate: [tuGuardiaDeCliente], // <-- Futuro: seguridad
        children: [
            { path: 'inicio', component: HomeUsuario },
            // { path: 'comunidad', component: ComunidadComponent },
            // { path: 'canjear', component: CanjearComponent },
            // ...etc

            // Si solo escriben '/usuario', llévalos a su inicio
            { path: '', redirectTo: 'inicio', pathMatch: 'full' }
        ]
    },

    // 1. RUTA PARA EL DASHBOARD (PANTALLA COMPLETA)
    // No usa el 'AdminLayout'
    {
        path: 'admin',
        component: AdminLayout,
        // canActivate: [tuGuardiaDeAdmin],
        children: [
            // Esta es tu página de "Herramientas"
            { path: 'inicio', component: MenuAdministrador },

            // Esta es tu página de "Gestión de Actividades"
            { path: 'actividades', component: ActividadesListarAdministradorComponent },
            { path: 'actividad/nuevo', component: ActividadesNuevoEditAdministradorComponent },
            { path: 'actividad/editar/:id', component: ActividadesNuevoEditAdministradorComponent },
            { path: 'reportes/empresas', component: ReportesListarAdministradorComponent },

            // Redirección por si entran a '/admin'
            { path: '', redirectTo: 'inicio', pathMatch: 'full' }
        ]
    },



    // --- Redirección por defecto ---
    // Si alguien entra a la app, que lo mande al login
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

    // Si no encuentra la ruta, al login
    { path: '**', redirectTo: 'auth/login' }
];
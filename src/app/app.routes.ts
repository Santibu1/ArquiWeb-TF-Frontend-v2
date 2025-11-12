import {Routes} from "@angular/router";
import {LoginComponent} from "./componente/login-component/login-component";
import {MenuAdministrador} from "./componente/administrador/menu-administrador/menu-administrador";
import {
    ActividadesListarAdministradorComponent
} from "./componente/administrador/actividades-listar-administrador/actividades-listar-administrador";
import {
    ActividadesNuevoEditAdministradorComponent
} from "./componente/administrador/actividades-nuevo-edit-administrador/actividades-nuevo-edit-administrador";
import {
    UsuariosListarAdministrador
} from "./componente/administrador/usuarios-listar-administrador/usuarios-listar-administrador";
import {
    ReportesListarAdministradorComponent
} from "./componente/administrador/reportes-listar-administrador/reportes-listar-administrador";
import {HomeUsuario} from "./componente/usuario/home-usuario/home-usuario";

export const routes: Routes = [
    // 🔐 LOGIN
    { path: 'login', component: LoginComponent },

    // 🧭 ADMINISTRADOR
    {
        path: 'admin',
        component: MenuAdministrador,
        children: [
            { path: 'actividades', component: ActividadesListarAdministradorComponent },
            { path: 'actividad/nuevo', component: ActividadesNuevoEditAdministradorComponent },
            { path: 'actividad/editar/:id', component: ActividadesNuevoEditAdministradorComponent },
            { path: 'usuarios', component: UsuariosListarAdministrador },
            { path: 'reportes', component: ReportesListarAdministradorComponent },
            //{ path: '', redirectTo: 'actividades', pathMatch: 'full' }
        ]
    },

    // 👤 USUARIO
    { path: 'usuario/home', component: HomeUsuario },

    // 🏠 RUTA POR DEFECTO
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // ❌ RUTA NO ENCONTRADA
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
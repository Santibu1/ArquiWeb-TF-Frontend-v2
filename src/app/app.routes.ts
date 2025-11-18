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
import {
    EmpresasListarAdministrador
} from "./componente/administrador/empresas-listar-administrador/empresas-listar-administrador";
import {
    EmpresasNuevoEditAdministrador
} from "./componente/administrador/empresas-nuevo-edit-administrador/empresas-nuevo-edit-administrador";
import {
    ProductosListarAdministrador
} from "./componente/administrador/productos-listar-administrador/productos-listar-administrador";
import {
    ProductosNuevoEditAdministrador
} from "./componente/administrador/productos-nuevo-edit-administrador/productos-nuevo-edit-administrador";
import {
    SolicitudesListarAdministrador
} from "./componente/administrador/solicitudes-listar-administrador/solicitudes-listar-administrador";
import {
    ComunidadesListarAdministradorComponent
} from "./componente/administrador/comunidades-listar-administrador/comunidades-listar-administrador";
import {RegisterComponent} from "./componente/register-component/register-component";

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
            { path: 'empresas', component: EmpresasListarAdministrador },
            { path: 'empresa/nuevo', component: EmpresasNuevoEditAdministrador },
            { path: 'empresa/editar/:id', component: EmpresasNuevoEditAdministrador },
            { path: 'productos', component: ProductosListarAdministrador },
            { path: 'producto/nuevo', component: ProductosNuevoEditAdministrador },
            { path: 'producto/editar/:id', component: ProductosNuevoEditAdministrador },
            { path: 'solicitudes', component: SolicitudesListarAdministrador },
            {path : 'comunidades', component: ComunidadesListarAdministradorComponent},

            { path: 'usuarios', component: UsuariosListarAdministrador },
            { path: 'reportes', component: ReportesListarAdministradorComponent },
            //{ path: '', redirectTo: 'actividades', pathMatch: 'full' }
        ]
    },

    // 👤 USUARIO
    { path: 'usuario/home', component: HomeUsuario },
    {path : 'registro' , component: RegisterComponent},
    // 🏠 RUTA POR DEFECTO
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // ❌ RUTA NO ENCONTRADA
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
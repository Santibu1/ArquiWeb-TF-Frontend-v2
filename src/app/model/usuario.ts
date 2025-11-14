export class Usuario {
    usuarioId: number;
    nombreUsuario: string;
    apellidoUsuario: string;
    emailUsuario: string;
    passwordUsuario?: string; // <-- Hecho opcional, no recibimos esto del backend
    edadUsuario: number;
    ecobits: number;
    rolId: number;
    planId: number;
}

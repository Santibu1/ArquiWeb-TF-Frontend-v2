export class UsuarioEventoDto {
    id?: number;
    usuarioId: number;
    eventoId: number;
    nombreUsuario?: string; // <--- NUEVO
    puntosGanados: number;
    estado: string;
}

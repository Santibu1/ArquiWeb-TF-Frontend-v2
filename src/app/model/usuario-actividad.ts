export class UsuarioActividad {
    id: number;
    usuarioId: number;
    actividadId: number;
    estado: string;          // "Completada", etc.
    fechaCompletado: string; // Viene como fecha ISO del backend
}

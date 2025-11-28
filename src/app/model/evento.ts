export class Evento {
    eventoId?: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    fecha: string; // Se envía como 'YYYY-MM-DD'
    organizador?: string;
    beneficios: string;
    recompensa: number;
    estado?: string;
    comunidadId: number;
}

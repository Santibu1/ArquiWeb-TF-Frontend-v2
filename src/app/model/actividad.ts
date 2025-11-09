// src/app/model/actividad.ts

export class Actividad {
    actividadId: number | null; // <-- ¡ESTA ES LA CORRECCIÓN!
    nombreActividad: string ;
    descripcionActividad: string ;
    recompensaActividad: number ;
    categoriaActividad: string ;
    estadoActividad: string ;
    usuario_id: number;
}
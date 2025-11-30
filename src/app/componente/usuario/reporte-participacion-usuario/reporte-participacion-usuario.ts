import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {ReporteParticipacion} from "../../../model/reporte-participacion";
import {ChartConfiguration, ChartData, ChartType, ChartDataset, ChartOptions} from "chart.js";
import {ReporteParticipacionService} from "../../../services/reporte-participacion-service";
import {BaseChartDirective} from "ng2-charts";
import {Chart, registerables} from "chart.js";
import {FormsModule} from "@angular/forms";
import {UsuarioService} from "../../../services/usuario-service";
import {AiService} from "../../../services/ai-service";
import {CommonModule} from "@angular/common";
Chart.register(...registerables);

@Component({
    selector: 'app-reporte-participacion-usuario',
    standalone:true,
    imports: [
        SubNavbarUsuario,
        BaseChartDirective,
        FormsModule,
        CommonModule
    ],
    templateUrl: './reporte-participacion-usuario.html',
    styleUrl: './reporte-participacion-usuario.css',
})
export class ReporteParticipacionUsuario implements OnInit {
    private usuarioEventoService = inject(ReporteParticipacionService);
    private usuarioService = inject(UsuarioService);
    private aiService = inject(AiService);

    barChartLabels: string[] = [];
    barChartData: { data: number[]; label: string }[] = [
        { data: [], label: 'Puntos obtenidos' }
    ];

    barChartOptions = {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    };

    // IA
    usuarioId!: number;
    recomendacionIA: string = "Cargando análisis inteligente...";
    cargandoIA: boolean = false;

    // KPIs nuevas
    totalMeses: number = 0;
    totalPuntos: number = 0;

    constructor() {}

    ngOnInit(): void {
        this.usuarioService.getMiPerfil().subscribe({
            next: perfil => {
                this.usuarioId = perfil.usuarioId;
                this.cargarDatos();
            },
            error: err => console.error(err)
        });
    }

    cargarDatos() {
        const anhoActual = new Date().getFullYear();

        let labels: string[] = [];
        let data: number[] = [];

        let contador = 0;

        let resumenMeses: { mes: number, nombre: string, puntos: number }[] = [];

        for (let mes = 1; mes <= 12; mes++) {
            this.usuarioEventoService.getReporteMensual(this.usuarioId, mes, anhoActual)
                .subscribe(rep => {

                    if (rep.totalEventos > 0) {
                        const nombreMes = this.nombreMes(mes);

                        labels.push(nombreMes);
                        data.push(rep.totalPuntos);

                        resumenMeses.push({
                            mes: mes,
                            nombre: nombreMes,
                            puntos: rep.totalPuntos
                        });
                    }

                    contador++;

                    // Cuando finalicen las 12 respuestas
                    if (contador === 12) {

                        // Orden cronológico
                        resumenMeses.sort((a, b) => a.mes - b.mes);

                        // Datos para IA
                        let datosParaIA = resumenMeses
                            .map(item => `${item.nombre}: ${item.puntos} pts.`)
                            .join(" ");

                        // Actualizar gráfica
                        this.barChartLabels = labels;
                        this.barChartData = [{ data: data, label: 'Puntos obtenidos' }];

                        // 📌 Cálculo KPI
                        this.totalMeses = resumenMeses.length;
                        this.totalPuntos = data.reduce((a, b) => a + b, 0);

                        // Enviar a IA
                        if (datosParaIA.length > 0) {
                            this.generarAnalisis(datosParaIA);
                        } else {
                            this.recomendacionIA = "Aún no tienes actividad suficiente para un análisis.";
                            this.cargandoIA = false;
                        }
                    }

                });
        }
    }

    generarAnalisis(datos: string) {
        this.cargandoIA = true;
        this.aiService.obtenerAnalisis(datos).subscribe({
            next: (respuestaTexto) => {
                this.recomendacionIA = respuestaTexto;
                this.cargandoIA = false;
            },
            error: (err) => {
                console.error("Error API IA:", err);
                this.recomendacionIA = "No se pudo conectar con el asistente ecológico.";
                this.cargandoIA = false;
            }
        });
    }

    escucharAnalisis() {
        this.aiService.leerTexto(this.recomendacionIA);
    }

    nombreMes(m: number): string {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[m - 1];
    }

}

import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {SubNavbarUsuario} from "../sub-navbar-usuario/sub-navbar-usuario";
import {ReporteParticipacion} from "../../../model/reporte-participacion";
import {ChartConfiguration, ChartData, ChartType, ChartDataset, ChartOptions} from "chart.js";
import {ReporteParticipacionService} from "../../../services/reporte-participacion-service";
import {BaseChartDirective} from "ng2-charts";
import {Chart, registerables} from "chart.js";
import {FormsModule} from "@angular/forms";
import {UsuarioService} from "../../../services/usuario-service";
Chart.register(...registerables);

@Component({
    selector: 'app-reporte-participacion-usuario',
    imports: [
        SubNavbarUsuario,
        BaseChartDirective,
        FormsModule
    ],
    templateUrl: './reporte-participacion-usuario.html',
    styleUrl: './reporte-participacion-usuario.css',
})
export class ReporteParticipacionUsuario implements OnInit {
    private usuarioEventoService = inject(ReporteParticipacionService);
    private usuarioService: UsuarioService =inject(UsuarioService);

    barChartLabels: string[] = [];
    barChartData : { data: number[]; label: string }[] = [
        { data: [], label: 'Puntos obtenidos' }
    ];

    barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    };

    usuarioId!: number;

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
        const anhoActual:number = new Date().getFullYear();

        let labels: string[] = [];
        let data: number[] = [];

        let contador:number = 0;

        for (let mes = 1; mes <= 12; mes++) {
            this.usuarioEventoService.getReporteMensual(this.usuarioId, mes, anhoActual)
                .subscribe(rep => {

                    if (rep.totalEventos > 0) {
                        labels.push(this.nombreMes(mes));
                        data.push(rep.totalPuntos);
                    }

                    contador++;

                    if (contador === 12) {
                        this.barChartLabels = labels;
                        this.barChartData = [
                            { data: data, label: 'Puntos obtenidos' }
                        ];
                    }
                });
        }
    }

    nombreMes(m: number): string {
        const meses = [
            'Enero','Febrero','Marzo','Abril','Mayo','Junio',
            'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
        ];
        return meses[m - 1];
    }

}

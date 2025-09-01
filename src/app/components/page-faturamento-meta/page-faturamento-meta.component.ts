import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header-geral/header-geral.component';
import { InfoCardComponent } from '../info-card/info-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ApiService } from '../../services/api.service';
import { FaturamentoAgrupado, MetaComparativo, ConsolidatedData } from '../../models/comparativo.model';
import { GraficoConfig } from 'src/app/models/grafico-config.model';
import { combineLatest, Subject, EMPTY } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { TabelaComponent, TableColumn } from '../tab-indicador/tab-indicador.component';

@Component({
  selector: 'page-faturamento-meta',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HeaderComponent,
    ChartCardComponent,
    TabelaComponent
  ],
  templateUrl: './page-faturamento-meta.component.html',
  styleUrls: ['./page-faturamento-meta.component.scss'],
})
export class PageFaturamentoMetaComponent implements OnInit, OnDestroy {


  
  private destroyed$ = new Subject<void>();

  faturamentoTN: ConsolidatedData[] = [];
  faturamentoTS: ConsolidatedData[] = [];
  metasComparativo: MetaComparativo[] = [];
  faturamentoTotal: ConsolidatedData[] = [];

  colunasTN: TableColumn[] = [
    { key: 'periodo', label: 'Data Emissão', formatter: (v) => this.labelMes(v) },
    { key: 'metaTN', label: 'Valor Meta', formatter: (v) => this.brl(v) },
    { key: 'faturamentoTN', label: 'Valor Nota', formatter: (v) => this.brl(v) }
  ];

  colunasTS: TableColumn[] = [
    { key: 'periodo', label: 'Data Emissão', formatter: (v) => this.labelMes(v) },
    { key: 'metaTS', label: 'Valor Meta', formatter: (v) => this.brl(v) },
    { key: 'faturamentoTS', label: 'Valor Nota', formatter: (v) => this.brl(v) }
  ];

  colunasTotal: TableColumn[] = [
    { key: 'periodo', label: 'Período', formatter: (v) => this.labelMes(v) },
    { key: 'faturamentoTN', label: 'TERMINAL NORTE', formatter: (v) => this.brl(v) },
    { key: 'faturamentoTS', label: 'TERMINAL SUL', formatter: (v) => this.brl(v) },
    { key: 'faturamentoTotal', label: 'Total', formatter: (v) => this.brl(v) }
  ];

  graficosConfig: GraficoConfig[] = [];
  loading = false;
  errorMsg = '';

  
  selectedPeriodo: string = '2024'; 
  anosDisponiveis: string[] = ['2024', '2025'];
  mesesDisponiveis = [
    { label: 'Jan/24', value: '2024-01' },
    { label: 'Fev/24', value: '2024-02' },
    { label: 'Mar/24', value: '2024-03' },
    { label: 'Abr/24', value: '2024-04' },
    { label: 'Mai/24', value: '2024-05' },
    { label: 'Jun/24', value: '2024-06' },
    { label: 'Jul/24', value: '2024-07' },
    { label: 'Ago/24', value: '2024-08' },
    { label: 'Set/24', value: '2024-09' },
    { label: 'Out/24', value: '2024-10' },
    { label: 'Nov/24', value: '2024-11' },
    { label: 'Dez/24', value: '2024-12' }
  ];

  private dadosConsolidadosOriginais: ConsolidatedData[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  readonly brl = (v: number | string | null | undefined) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(Number(v ?? 0));

    

    carregarDados(): void {
    this.loading = true;
    this.errorMsg = '';

    combineLatest([this.api.getFaturamentoAgrupado(), this.api.getMetaComparativo()])
      .pipe(
        tap(([fat, metas]) => {
          this.dadosConsolidadosOriginais = this.consolidarDados(fat, metas);
          this.metasComparativo = metas;
          this.aplicarFiltro();
          this.loading = false;
        }),
        catchError(err => {
          console.error('ERRO NAS REQUISIÇÕES:', err);
          this.errorMsg = 'Não foi possível carregar os dados.';
          this.loading = false;
          return EMPTY;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
  }

  aplicarFiltro(): void {
    let dadosFiltrados: ConsolidatedData[];

    if (/^\d{4}$/.test(this.selectedPeriodo)) {
      dadosFiltrados = this.dadosConsolidadosOriginais.filter(d => d.periodo.startsWith(this.selectedPeriodo));
    } else {
      dadosFiltrados = this.dadosConsolidadosOriginais.filter(d => d.periodo === this.selectedPeriodo);
    }

    this.faturamentoTN = dadosFiltrados;
    this.faturamentoTS = dadosFiltrados;
    this.faturamentoTotal = dadosFiltrados;
    this.graficosConfig = this.gerarGraficos(dadosFiltrados);
  }

  private consolidarDados(faturamentoApiData: FaturamentoAgrupado[], metaApiData: MetaComparativo[]): ConsolidatedData[] {
    const dataMap = new Map<string, ConsolidatedData>();

    for (const item of faturamentoApiData) {
      if (!item.periodo) continue;
      const mes = this.toYYYYMM(item.periodo);

      if (mes >= '2024-01' && mes <= '2025-12') {
        if (!dataMap.has(mes)) {
          dataMap.set(mes, {
            periodo: mes,
            faturamentoTN: 0,
            faturamentoTS: 0,
            metaTN: 0,
            metaTS: 0,
            metaTotal: 0,
            faturamentoTotal: 0
          });
        }
        const dadosMes = dataMap.get(mes)!;
        if (item.filial.toUpperCase().includes('NORTE')) {
          dadosMes.faturamentoTN += Number(item.valor_total ?? 0);
        } else if (item.filial.toUpperCase().includes('SUL')) {
          dadosMes.faturamentoTS += Number(item.valor_total ?? 0);
        }
        dadosMes.faturamentoTotal = dadosMes.faturamentoTN + dadosMes.faturamentoTS;
      }
    }

    for (const item of metaApiData) {
      const mes = this.toYYYYMM(item.data);
      if (mes >= '2024-01' && mes <= '2025-12') {
        if (!dataMap.has(mes)) {
          dataMap.set(mes, {
            periodo: mes,
            faturamentoTN: 0,
            faturamentoTS: 0,
            metaTN: 0,
            metaTS: 0,
            metaTotal: 0,
            faturamentoTotal: 0
          });
        }
        const dadosMes = dataMap.get(mes)!;
        dadosMes.metaTN += Number(item.tn ?? 0);
        dadosMes.metaTS += Number(item.ts ?? 0);
        dadosMes.metaTotal += Number(item.total ?? 0);
      }
    }

    return Array.from(dataMap.values()).sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  private toYYYYMM(d: string | Date): string {
    if (typeof d === 'string' && d.length >= 7) return d.slice(0, 7);
    const date = new Date(d);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private labelMes(yyyymm: string): string {
    const [y, m] = yyyymm.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, 1));
    const mes = dt.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
    const ano = dt.toLocaleDateString('pt-BR', { year: '2-digit', timeZone: 'UTC' });
    return `${mes.charAt(0).toUpperCase() + mes.slice(1)}/${ano}`;
  }

  private gerarGraficos(dadosConsolidados: ConsolidatedData[]): GraficoConfig[] {
    const xLabels = dadosConsolidados.map(item => this.labelMes(item.periodo));
    const palette = { bar: '#0050fcff', line: '#fd2a2aff' };

    return [
      {
        title: 'Filial TERMINAL NORTE',
        xAxisLabels: xLabels,
        yAxisOptions: [{ type: 'value', axisLabel: { formatter: (val: number) => this.brl(val) }, splitLine: { show: true } }],
        seriesData: [
          { name: 'Faturamento TN', type: 'bar', data: dadosConsolidados.map(d => d.faturamentoTN), itemStyle: { color: palette.bar }, emphasis: { focus: 'series' } },
          { name: 'Meta TN', type: 'line', data: dadosConsolidados.map(d => d.metaTN), smooth: true, lineStyle: { width: 3, color: palette.line }, itemStyle: { color: palette.line }, symbol: 'circle', symbolSize: 6 }
        ]
      },
      {
        title: 'Filial TERMINAL SUL',
        xAxisLabels: xLabels,
        yAxisOptions: [{ type: 'value', axisLabel: { formatter: (val: number) => this.brl(val) }, splitLine: { show: true } }],
        seriesData: [
          { name: 'Faturamento TS', type: 'bar', data: dadosConsolidados.map(d => d.faturamentoTS), itemStyle: { color: palette.bar }, emphasis: { focus: 'series' } },
          { name: 'Meta TS', type: 'line', data: dadosConsolidados.map(d => d.metaTS), smooth: true, lineStyle: { width: 3, color: palette.line }, itemStyle: { color: palette.line }, symbol: 'circle', symbolSize: 6 }
        ]
      },
      {
        title: 'Total Faturamento X Meta',
        xAxisLabels: xLabels,
        yAxisOptions: [{ type: 'value', axisLabel: { formatter: (val: number) => this.brl(val) }, splitLine: { show: true } }],
        seriesData: [
          { name: 'Faturamento Total', type: 'bar', data: dadosConsolidados.map(d => d.faturamentoTotal), itemStyle: { color: palette.bar }, emphasis: { focus: 'series' } },
          { name: 'Meta Total', type: 'line', data: dadosConsolidados.map(d => d.metaTotal), smooth: true, lineStyle: { width: 3, color: palette.line }, itemStyle: { color: palette.line }, symbol: 'circle', symbolSize: 6 }
        ]
      }
    ];
  }
}

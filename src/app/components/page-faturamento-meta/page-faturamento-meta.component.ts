// page-faturamento-meta.component.ts
import { Component, OnInit, DestroyRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header-geral/header-geral.component';
import { InfoCardComponent } from '../info-card/info-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';

import { ApiService } from '../../services/api.service';
import { FaturamentoAgrupado, MetaComparativo } from '../../models/comparativo.model';
import { GraficoConfig } from 'src/app/models/grafico-config.model';

import { combineLatest } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'page-faturamento-meta',
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent, InfoCardComponent, ChartCardComponent],
  templateUrl: './page-faturamento-meta.component.html',
  styleUrls: ['./page-faturamento-meta.component.scss'],
})
export class PageFaturamentoMetaComponent implements OnInit {
  graficosConfig: GraficoConfig[] = [];
  loading = false;
  errorMsg = '';

  constructor(private api: ApiService, private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  // formatter BRL para tooltip/eixo (usado no ChartCard via [valueFormatter])
  readonly brl = (v: number | string | null | undefined) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 })
      .format(Number(v ?? 0));

  carregarDados(): void {
    this.loading = true;
    this.errorMsg = '';

    const faturamento$ = this.api.getFaturamentoAgrupado();   // -> [{periodo:'2024-01', valor_total, filial}]
    const metas$       = this.api.getMetaComparativo();       // -> [{data:'2024-01-01', tn, ts, total}]

    const sub = combineLatest([faturamento$, metas$]).pipe(
      map(([fat, metas]) => this.gerarGraficos(fat, metas)),
      tap(cfgs => { this.graficosConfig = cfgs; this.loading = false; }),
      catchError(err => {
        console.error('ERRO NAS REQUISIÇÕES:', err);
        this.errorMsg = 'Não foi possível carregar os dados.';
        this.loading = false;
        return [];
      })
    ).subscribe();

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  // --- helpers ---
  /** '2024-01-15' | Date -> '2024-01' */
  private toYYYYMM(d: string | Date): string {
    const dt = (typeof d === 'string') ? new Date(d) : d;
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  /** '2024-01' -> 'jan/2024' (pt-BR) */
  private labelMes(yyyymm: string): string {
    const [y, m] = yyyymm.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, 1));
    return dt.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
  }

  /** Normaliza nome da filial para chave de meta ('tn' | 'ts') */
  private mapFilialToMetaKey(filial: string): 'tn' | 'ts' {
    // remove acentos e normaliza
    const f = filial.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (f.startsWith('tn') || f.includes('norte')) return 'tn';
    if (f.startsWith('ts') || f.includes('sul'))   return 'ts';
    return 'tn'; // fallback: ajuste conforme sua realidade
  }

  private gerarGraficos(
    faturamentoApiData: FaturamentoAgrupado[],
    metaApiData: MetaComparativo[],
  ): GraficoConfig[] {

    // 1) Meses
    const mesesFaturamento = new Set(faturamentoApiData.map(f => f.periodo)); // 'YYYY-MM'
    const mesesMeta = new Set(metaApiData.map(m => this.toYYYYMM(m.data as any)));

    // 2) União ordenada
    const todosMeses = Array.from(new Set([...mesesFaturamento, ...mesesMeta])).sort(); // 'YYYY-MM'
    const xLabels = todosMeses.map(this.labelMes); // ex.: 'jan/2024'

    // 3) Índices auxiliares
    const fatIdx = new Map<string, number>(); // `${mes}-${filial}` -> valor_total
    for (const f of faturamentoApiData) {
      const key = `${f.periodo}-${f.filial}`;
      const atual = fatIdx.get(key) ?? 0;
      fatIdx.set(key, atual + Number(f.valor_total ?? 0));
    }

    const metaIdx = new Map<string, { tn: number; ts: number; total: number }>();
    for (const m of metaApiData) {
      const mes = this.toYYYYMM(m.data as any);
      metaIdx.set(mes, {
        tn: Number((m as any).tn ?? 0),
        ts: Number((m as any).ts ?? 0),
        total: Number((m as any).total ?? 0),
      });
    }

    // 4) Filiais presentes no faturamento
    const filiais = Array.from(new Set(faturamentoApiData.map(f => f.filial))).sort();

    // Paleta local (cores definidas na página)
    const palette = {
      tn:    { bar: '#60a5fa', line: '#fde047' }, // azul | amarelo
      ts:    { bar: '#a78bfa', line: '#34d399' }, // roxo | verde
      total: { bar: '#93c5fd', line: '#22d3ee' }, // azul claro | ciano
    } as const;

    const graficos: GraficoConfig[] = [];

    // 5) Um gráfico por filial
    for (const filial of filiais) {
      const metaKey: 'tn' | 'ts' = this.mapFilialToMetaKey(filial);

      const serieFaturamento = todosMeses.map(m => fatIdx.get(`${m}-${filial}`) ?? 0);
      const serieMeta        = todosMeses.map(m => metaIdx.get(m)?.[metaKey] ?? 0);

      const cor = palette[metaKey];

      graficos.push({
        title: `Faturamento vs Meta - Filial ${filial}`,
        xAxisLabels: xLabels,
        yAxisOptions: [{
          type: 'value',
          axisLabel: { formatter: (val: number) => this.brl(val) },
          splitLine: { show: true }
        }],
        seriesData: [
          {
            name: `Faturamento ${filial}`,
            type: 'bar',
            data: serieFaturamento,
            itemStyle: { color: cor.bar },
            emphasis: { focus: 'series' }
          },
          {
            name: `Meta ${filial}`,
            type: 'line',
            data: serieMeta,
            smooth: true,
            lineStyle: { width: 3, color: cor.line },
            itemStyle: { color: cor.line },
            symbol: 'circle',
            symbolSize: 6
          }
        ]
      });
    }

    // 6) Gráfico Total (se houver meta.total)
    const temMetaTotal = metaApiData.some(m => (m as any).total != null);
    if (temMetaTotal) {
      const serieFatTotal  = todosMeses.map(m =>
        filiais.reduce((acc, filial) => acc + (fatIdx.get(`${m}-${filial}`) ?? 0), 0)
      );
      const serieMetaTotal = todosMeses.map(m => metaIdx.get(m)?.total ?? 0);

      graficos.push({
        title: 'Faturamento vs Meta - Total',
        xAxisLabels: xLabels,
        yAxisOptions: [{
          type: 'value',
          axisLabel: { formatter: (val: number) => this.brl(val) }
        }],
        seriesData: [
          {
            name: 'Faturamento Total',
            type: 'bar',
            data: serieFatTotal,
            itemStyle: { color: palette.total.bar }
          },
          {
            name: 'Meta Total',
            type: 'line',
            data: serieMetaTotal,
            smooth: true,
            lineStyle: { width: 3, color: palette.total.line },
            itemStyle: { color: palette.total.line },
            symbol: 'circle',
            symbolSize: 6
          }
        ]
      });
    }

    return graficos;
  }
}

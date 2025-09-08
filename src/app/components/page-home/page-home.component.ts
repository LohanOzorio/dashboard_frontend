import { Component, OnInit, signal,DestroyRef } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { ChartCardComponent } from '../chart-card/chart-card.component';


import { FaturamentoAgrupado, MetaComparativo } from '../../models/comparativo.model';
import { GraficoConfig } from 'src/app/models/grafico-config.model';

// C
import { kpiCardComponent } from '../kpi-component/info-card.component';
import { HeaderComponent } from '../header-geral/header-geral.component';

// api
import { ApiService } from '../../services/api.service';
import { Faturamento } from '../../models/faturamento.model';
import { Meta } from '../../models/meta.model';
import { NaturezaCusto } from '../../models/naturezacusto.model';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule,HeaderComponent, ChartCardComponent],
  selector: 'page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss'],
})
export class PageHomeComponent {

graficosConfig: GraficoConfig[] = [];
  loading = false;
  errorMsg = '';

  constructor(private api: ApiService, private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.carregarDados();
  }


  readonly brl = (v: number | string | null | undefined) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 })
      .format(Number(v ?? 0));

  carregarDados(): void {
    this.loading = true;
    this.errorMsg = '';

    const faturamento$ = this.api.getFaturamentoAgrupado();
    const metas$       = this.api.getMetaComparativo();

    const sub = combineLatest([faturamento$, metas$]).pipe(
      map(([fat, metas]) => this.gerarGraficos(fat, metas)),
      tap(cfgs => { this.graficosConfig = cfgs; this.loading = false; }),
      catchError(err => {
        console.error('ERRO NAS REQUISIÇÕES:', err?.status, err?.url, err?.message, err?.error);
        this.errorMsg = 'Não foi possível carregar os dados.';
        this.loading = false;
        return [];
      })
    ).subscribe();

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  
  private toYYYYMM(d: string | Date): string {
    const dt = (typeof d === 'string') ? new Date(d) : d;
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  private labelMes(yyyymm: string): string {
    const [y, m] = yyyymm.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, 1));
    return dt.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
  }

  private gerarGraficos(
    faturamentoApiData: FaturamentoAgrupado[],
    metaApiData: MetaComparativo[],
  ): GraficoConfig[] {

    const mesesFaturamento = new Set(faturamentoApiData.map(f => f.periodo)); // 'YYYY-MM'
    const mesesMeta = new Set(metaApiData.map(m => this.toYYYYMM(m.data as any)));

    const todosMeses = Array.from(new Set([...mesesFaturamento, ...mesesMeta])).sort();
    const xLabels = todosMeses.map(this.labelMes);

    const fatIdx = new Map<string, number>();
    for (const f of faturamentoApiData) {
      const key = `${f.periodo}-${f.filial}`;
      fatIdx.set(key, Number(fatIdx.get(key) ?? 0) + Number(f.valor_total ?? 0));
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

    const filiais = Array.from(new Set(faturamentoApiData.map(f => f.filial))).sort();
    const graficos: GraficoConfig[] = [];

    for (const filial of filiais) {
      const metaKey = filial.toLowerCase() as 'tn' | 'ts';
      const serieFaturamento = todosMeses.map(m => fatIdx.get(`${m}-${filial}`) ?? 0);
      const serieMeta        = todosMeses.map(m => metaIdx.get(m)?.[metaKey] ?? 0);

      graficos.push({
        title: `Faturamento vs Meta - Filial ${filial}`,
        xAxisLabels: xLabels,
        yAxisOptions: [{
          type: 'value',
          axisLabel: { formatter: (val: number) => this.brl(val) },
          splitLine: { show: true }
        }],
        seriesData: [
          { name: `Faturamento ${filial}`, type: 'bar',  data: serieFaturamento },
          { name: `Meta ${filial}`,        type: 'line', data: serieMeta }
        ]
      });
    }

    const temMetaTotal = metaApiData.some(m => (m as any).total != null);
    if (temMetaTotal) {
      const serieFatTotal  = todosMeses.map(m => filiais.reduce((acc, filial) => acc + (fatIdx.get(`${m}-${filial}`) ?? 0), 0));
      const serieMetaTotal = todosMeses.map(m => metaIdx.get(m)?.total ?? 0);

      graficos.push({
        title: 'Faturamento vs Meta - Total',
        xAxisLabels: xLabels,
        yAxisOptions: [{
          type: 'value',
          axisLabel: { formatter: (val: number) => this.brl(val) }
        }],
        seriesData: [
          { name: 'Faturamento Total', type: 'bar',  data: serieFatTotal },
          { name: 'Meta Total',        type: 'line', data: serieMetaTotal }
        ]
      });
    }

    return graficos;
  }

 
}
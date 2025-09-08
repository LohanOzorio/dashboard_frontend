import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonCol, IonGrid, IonRow, IonProgressBar, IonModal, IonTitle } from '@ionic/angular/standalone';
import { TabelaComponent } from 'src/app/components/tab-indicador/tab-indicador.component';
import { HeaderComponent } from 'src/app/components/header-geral/header-geral.component';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { ApiService } from 'src/app/services/api.service';
import { Cliente } from 'src/app/models/faturamento.model';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ConsolidatedData, FaturamentoAgrupado, MetaComparativo } from '../../models/comparativo.model';

@Component({
  selector: 'app-page-faturamento-geral',
  standalone: true,
  imports: [IonTitle, 
    IonProgressBar, IonRow, IonGrid, IonCol, IonButton, IonButtons, IonContent, IonHeader, IonToolbar, IonModal, IonIcon,
    CommonModule, FormsModule, TabelaComponent, HeaderComponent, DateFilterComponent, ChartCardComponent
  ],
  templateUrl: './page-faturamento-geral.component.html',
  styleUrls: ['./page-faturamento-geral.component.scss'],
})
export class PageFaturamentoGeralComponent implements OnInit, OnDestroy {

  @ViewChild(IonModal) filterModal!: IonModal;

  clientes: Cliente[] = [];
  topServicos: any[] = [];
  totalServicos = 0;
  columnsServicos = [
    { key: 'servico', label: 'Serviço' },
    { key: 'valor_nota', label: 'Valor', formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    { key: 'porcentagem', label: '%', formatter: (v: number) => v.toFixed(2) + '%' },
  ];

  topClientes: any[] = [];
  totalClientes = 0;
  columnsClientes = [
    { key: 'nome', label: 'Cliente' },
    { key: 'valor_nota', label: 'Valor', formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    { key: 'porcentagem', label: '%', formatter: (v: number) => v.toFixed(2) + '%' },
  ];

  faturamentoDiario: any[] = [];
  columnsFaturamentoDiario = [
    { key: 'data_emissao', label: 'Data' },
    { key: 'valor_nota', label: 'Valor', formatter: (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
  ];

  dadosConsolidados: ConsolidatedData[] = [];
  chartTitle = 'Faturamento TN x TS';
  xAxisLabels: string[] = [];
  seriesData: any[] = [];
  yAxisOptions: any[] = [];
  loading = true;
  errorMsg: string | null = null;

  private destroy$ = new Subject<void>();

  filterType: 'day' | 'month' | 'year' = 'month';
  selectedFilterValue: string | number | Date = 2024;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.carregarClientes();
    this.carregarConsolidado();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 
  dismissModal() {
    this.filterModal.dismiss();
  }

  
  carregarClientes() {
    this.api.getCliente().subscribe(data => {
      this.clientes = data;
      this.processarTopServicosClientes(data);
    });
  }

  private processarTopServicosClientes(data: Cliente[]) {
    const servicosMap: Record<string, number> = {};
    data.forEach(c => {
      const key = c.servico || 'Sem Serviço';
      if (!servicosMap[key]) servicosMap[key] = 0;
      servicosMap[key] += c.valor_nota || 0;
    });
    const totalServ = Object.values(servicosMap).reduce((acc, v) => acc + v, 0);
    this.totalServicos = totalServ;
    this.topServicos = Object.entries(servicosMap)
      .map(([servico, valor]) => ({ servico, valor_nota: valor, porcentagem: totalServ ? (valor / totalServ) * 100 : 0 }))
      .sort((a, b) => b.valor_nota - a.valor_nota)
      .slice(0, 10);

    const clientesMap: Record<string, number> = {};
    data.forEach(c => {
      const key = c.nome;
      if (!clientesMap[key]) clientesMap[key] = 0;
      clientesMap[key] += c.valor_nota || 0;
    });
    const totalClientes = Object.values(clientesMap).reduce((acc, v) => acc + v, 0);
    this.totalClientes = totalClientes;
    this.topClientes = Object.entries(clientesMap)
      .map(([nome, valor]) => ({ nome, valor_nota: valor, porcentagem: totalClientes ? (valor / totalClientes) * 100 : 0 }))
      .sort((a, b) => b.valor_nota - a.valor_nota)
      .slice(0, 10);

    this.faturamentoDiario = this.agruparFaturamentoPorDia(data);
  }

  private agruparFaturamentoPorDia(data: Cliente[]): any[] {
    const map: Record<string, number> = {};
    data.forEach(c => {
      const key = c.data_emissao;
      if (!map[key]) map[key] = 0;
      map[key] += c.valor_nota || 0;
    });
    return Object.entries(map)
      .map(([data_emissao, valor_nota]) => ({ data_emissao, valor_nota }))
      .sort((a, b) => new Date(a.data_emissao).getTime() - new Date(b.data_emissao).getTime());
  }

  
  carregarConsolidado() {
    this.loading = true;
    combineLatest([this.api.getFaturamentoAgrupado(), this.api.getMetaComparativo()])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([fat, metas]: [FaturamentoAgrupado[], MetaComparativo[]]) => {
          this.dadosConsolidados = this.consolidarDados(fat, metas);
          this.montarGrafico(this.dadosConsolidados);
          this.loading = false;
        },
        error: () => {
          this.errorMsg = 'Erro ao carregar dados de faturamento.';
          this.loading = false;
        }
      });
  }

  private consolidarDados(faturamentoApiData: FaturamentoAgrupado[], metaApiData: MetaComparativo[]): ConsolidatedData[] {
    const dataMap = new Map<string, ConsolidatedData>();

    for (const item of faturamentoApiData) {
      if (!item.periodo) continue;
      const mes = this.toYYYYMM(item.periodo);
      if (!dataMap.has(mes)) {
        dataMap.set(mes, { periodo: mes, faturamentoTN: 0, faturamentoTS: 0, metaTN: 0, metaTS: 0, metaTotal: 0, faturamentoTotal: 0 });
      }
      const dadosMes = dataMap.get(mes)!;
      if (item.filial.toUpperCase().includes('NORTE')) dadosMes.faturamentoTN += Number(item.valor_total ?? 0);
      else if (item.filial.toUpperCase().includes('SUL')) dadosMes.faturamentoTS += Number(item.valor_total ?? 0);
      dadosMes.faturamentoTotal = dadosMes.faturamentoTN + dadosMes.faturamentoTS;
    }

    for (const item of metaApiData) {
      const mes = this.toYYYYMM(item.data);
      if (!dataMap.has(mes)) {
        dataMap.set(mes, { periodo: mes, faturamentoTN: 0, faturamentoTS: 0, metaTN: 0, metaTS: 0, metaTotal: 0, faturamentoTotal: 0 });
      }
      const dadosMes = dataMap.get(mes)!;
      dadosMes.metaTN += Number(item.tn ?? 0);
      dadosMes.metaTS += Number(item.ts ?? 0);
      dadosMes.metaTotal += Number(item.total ?? 0);
    }

    return Array.from(dataMap.values()).sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  private montarGrafico(dados: ConsolidatedData[]) {
    this.xAxisLabels = dados.map(d => this.labelMes(d.periodo));
    this.seriesData = [
      { name: 'Faturamento TN', type: 'bar', data: dados.map(d => Number(d.faturamentoTN ?? 0)), itemStyle: { color: '#0050fcff' } },
      { name: 'Faturamento TS', type: 'bar', data: dados.map(d => Number(d.faturamentoTS ?? 0)), itemStyle: { color: '#00b050ff' } }
    ];
    this.yAxisOptions = [
      {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
        },
        splitLine: { show: true }
      }
    ];
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


  onFilterChange(filter: { type: 'day' | 'month' | 'year', value: any }) {
    this.filterType = filter.type;
    this.selectedFilterValue = filter.value;

    if (!this.dadosConsolidados?.length) return;

    let dadosFiltrados: ConsolidatedData[] = [];

    if (filter.type === 'day') {
      const selectedDate = filter.value as Date;
      const selectedYYYYMM = selectedDate.toISOString().slice(0, 7);
      dadosFiltrados = this.dadosConsolidados.filter(d => d.periodo === selectedYYYYMM);
    } else if (filter.type === 'month') {
      const selectedMonth = filter.value as string;
      dadosFiltrados = this.dadosConsolidados.filter(d => d.periodo === selectedMonth);
    } else if (filter.type === 'year') {
      const selectedYear = filter.value as number;
      dadosFiltrados = this.dadosConsolidados.filter(d => d.periodo.startsWith(selectedYear.toString()));
    }

    this.montarGrafico(dadosFiltrados);

    
    this.dismissModal();
  }
}

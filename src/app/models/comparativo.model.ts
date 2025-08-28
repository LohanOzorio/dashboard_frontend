
export interface FaturamentoAgrupado {
  periodo: string;      
  valor_total: number;  
  filial: string;       
}

export interface MetaComparativo {
  data: Date;
  tn: number;
  ts: number;
  total: number;
}
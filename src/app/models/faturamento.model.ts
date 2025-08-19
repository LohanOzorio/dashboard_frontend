
export interface Faturamento {
  
  data_emissao: string;
 
  valor_nota: number | null;
}


export interface FaturamentoMetaFull {
  data_emissao?: string | null;
  data_emissao1?: string | null;
  filial?: string | null;
  num_nota?: number | null;
  serie?: string | null;
  cod_vend?: string | null;
  vendedor?: string | null;
  cod_pagto?: number | null;  
  pagamento?: string | null;
  cliente?: number | null;
  qtd_clientes?: number | null;
  nome?: string | null;
  municipio?: string | null;
  cod_prod?: string | null;
  servico?: string | null;
  primeira_compra?: string | null;
  ultima_compra?: string | null;
  valor_nota?: number | null;
  classificacao_inatividade?: string | null;
  dias_sem_compra?: string | null;
  id: number; 
}

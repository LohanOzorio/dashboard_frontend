import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { Meta, MetaTN, MetaTS } from '../models/meta.model';
import { Cliente, Faturamento } from '../models/faturamento.model';
import { NaturezaCusto } from '../models/naturezacusto.model';
import { MetaComparativo, FaturamentoAgrupado } from '../models/comparativo.model';
import { GraficoConfig } from '../models/grafico-config.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3600';

  constructor(private http: HttpClient) {}
  
  getFaturamento(): Observable<Faturamento[]> {
    return this.http.get<Faturamento[]>(`${this.baseUrl}/faturamento`);
  }

  getCliente():Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${this.baseUrl}/clientes`)
  }
  
  getMetas(): Observable<Meta[]> {
    return this.http.get<Meta[]>(`${this.baseUrl}/metas`);
  }

  getMetasTN(): Observable<MetaTN[]> {
    return this.http.get<MetaTN[]>(`${this.baseUrl}/metas/tn`);
  }

  getMetasTS(): Observable<MetaTS[]> {
    return this.http.get<MetaTS[]>(`${this.baseUrl}/metas/ts`);
  }

  getMetasByDate(date: string): Observable<Meta[]> {
    return this.http.get<Meta[]>(`${this.baseUrl}/metas/by-date?date=${date}`);
  }
 
  getNaturezaCusto(): Observable<NaturezaCusto[]> {
    return this.http.get<NaturezaCusto[]>(`${this.baseUrl}/natureza-custo`);
  }

  getNaturezaCustoById(id: string): Observable<NaturezaCusto> {
    return this.http.get<NaturezaCusto>(`${this.baseUrl}/natureza-custoId?id=${id}`);
  }

  getFaturamentoAgrupado(): Observable<FaturamentoAgrupado[]> {
    return this.http.get<FaturamentoAgrupado[]>(`${this.baseUrl}/faturamento/agrupado`);
  }

  getMetaComparativo(): Observable<MetaComparativo[]> {
    return this.http.get<MetaComparativo[]>(`${this.baseUrl}/metas/comparativo`);
  }
}

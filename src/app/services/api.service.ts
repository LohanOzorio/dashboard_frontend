import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3600'; // URL do seu Fastify

  constructor(private http: HttpClient) {}

  // Faturamento
  getFaturamento(): Observable<any> {
    return this.http.get(`${this.baseUrl}/faturamento`);
  }

  // Metas
  getMetas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metas`);
  }
  getMetasTN(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metas/tn`);
  }
  getMetasTS(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metas/ts`);
  }
  getMetasByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/metas/by-date?date=${date}`);
  }

  // Natureza de Custo
  getNaturezaCusto(): Observable<any> {
    return this.http.get(`${this.baseUrl}/natureza-custo`);
  }
  getNaturezaCustoById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/natureza-custoId?id=${id}`);
  }
}

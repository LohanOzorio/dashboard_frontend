import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'http://localhost:3600'; 

  constructor(private http: HttpClient) {}

  getFaturamento(): Observable<any> {
    return this.http.get(`${this.API_URL}/faturamento`);
  }

  getMetas(): Observable<any> {
    return this.http.get(`${this.API_URL}/metas`);
  }

  getNaturezaCusto(): Observable<any> {
    return this.http.get(`${this.API_URL}/natureza-custo`);
  }
}

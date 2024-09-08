import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresas } from './empresas';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private url = 'http://localhost:3000/empresas';
  constructor(private httpClient: HttpClient) { }

  getEmpresas() {
    return this.httpClient.get<Empresas[]>(this.url);
  }

  getEmpresa(id: string) {
    return this.httpClient.get<Empresas>(`${this.url}/${id}`);
  }

  addEmpresa(empresa: Empresas) {
    return this.httpClient.post(this.url, empresa);
  }

  updateEmpresa(id: string, empresa: Empresas) {
    return this.httpClient.put(`${this.url}/${id}`, empresa);
  }

  deleteEmpresa(id: string) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}

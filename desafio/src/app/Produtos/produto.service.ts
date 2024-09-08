import { Injectable } from '@angular/core';
import { Produto } from './produto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private url = 'http://localhost:3000/produtos';
  constructor(private httpClient: HttpClient) { }

  getProdutos() {
    return this.httpClient.get<Produto[]>(this.url);
  }

  getProdutoiD(id : string) {
    return this.httpClient.get<Produto>(`${this.url}/${id}`);
  }

  addProduto(produto: Produto) {
    return this.httpClient.post(this.url, produto);
  }

  updateProduto(id: string, produto: Produto) {
    return this.httpClient.put(`${this.url}/${id}`, produto);
  }

  deleteProduto(id: string) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ProdutoService } from '../Produtos/produto.service';
import { EmpresaService } from '../Empresas/empresa.service';
import { HeaderComponent } from '../Shared/header/header.component';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule, MatTableModule, HeaderComponent],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {
  categorias: { categoria: string, quantidade: number }[] = [];
  produtosFaltando: any[] = [];
  fornecedoresFaltando: any[] = [];
  flag: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(data => {
      const categoriaMap = new Map<string, number>();

      for (let produto of data) {
        const categoriaUpper = produto.categoria.toUpperCase();
        if (categoriaMap.has(categoriaUpper)) {
          categoriaMap.set(categoriaUpper, produto.quantidade + categoriaMap.get(categoriaUpper)!);
        } else {
          categoriaMap.set(categoriaUpper, produto.quantidade);
        }
      }

      this.categorias = Array.from(categoriaMap, ([categoria, quantidade]) => ({ categoria, quantidade }))
      .sort((a, b) => a.categoria.localeCompare(b.categoria));
    });

    this.produtoService.getProdutos().subscribe(data => {
       for (let produto of data) {
         if (produto.quantidade === 0) {
           this.produtosFaltando.push(produto);
         }
       }
    });
    this.empresaService.getEmpresas().subscribe(data => {
      for (let empresa of data) {
        this.produtoService.getProdutos().subscribe(produtos => {
          this.flag = false;
          for (let produto of produtos) {
            if(produto.fornecedor == empresa.id){
              this.flag = true;
              if (produto.quantidade === 0) {
                if(!this.fornecedoresFaltando.includes(empresa.nome)) {
                  this.fornecedoresFaltando.push(empresa.nome);
                }
              }
            }
          }
          if(!this.flag){
            if(!this.fornecedoresFaltando.includes(empresa.nome)) {
              this.fornecedoresFaltando.push(empresa.nome);
            }
          }
        });
      }
    });
  }
}

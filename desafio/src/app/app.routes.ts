import { Routes } from '@angular/router';
import { ProdutoComponent } from './Produtos/produto/produto.component';
import { AddProdutoComponent } from './Produtos/criar-produto/criar-produto.component';
import { EmpresaComponent } from './Empresas/empresa/empresa.component';

import { RelatorioComponent } from './relatorio/relatorio.component';
import { VowelComponent } from './api/vowel/vowel.component';
export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ProdutoComponent },
  { path: 'produtos/:id', component: ProdutoComponent },
  { path: 'empresas', component: EmpresaComponent },
  { path: 'empresas/:id', component: EmpresaComponent },
  { path: 'adicionar', component: AddProdutoComponent },
  { path: 'produtos/editar/:id', component: AddProdutoComponent },
  { path: 'api', component: VowelComponent},
  { path: 'relatorios', component: RelatorioComponent },
  { path: '**', redirectTo: 'produtos' }
];

import { Component } from '@angular/core';
import { ProdutoService } from '../produto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, delay, Observable } from 'rxjs';
import { Produto } from '../produto';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, Location } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { EmpresaComponent } from '../../Empresas/empresa/empresa.component';
import { EmpresaService } from '../../Empresas/empresa.service';
import { HeaderComponent } from '../../Shared/header/header.component';
@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [ AsyncPipe, MatSnackBarModule, MatButtonModule, MatIconModule, MatTableModule, EmpresaComponent, HeaderComponent ],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent {
  produto$: Observable<Produto[]>;
  produtos_array: Produto[] = [];
  displayedColumns: string[] = ['nome', 'preco', 'categoria', 'quantidade', 'fornecedor', 'acao'];
  constructor(
    private produtoService: ProdutoService,
    public snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private emppresaService: EmpresaService
  ){
    produtoService.getProdutos().subscribe(p => this.produtos_array = p)
    this.produtos_array.forEach(produto => {
      this.emppresaService.getEmpresa(produto.fornecedor).subscribe(empresa => {
        produto.fornecedor = empresa.nome; // Supondo que o modelo de Empresa tenha um campo 'nome'
      });
    });
    this.produto$ = produtoService.getProdutos()
    .pipe(delay(3000))
    .pipe(
      catchError(error => {
        this.snackBar.open('Erro ao carregar a lista de produtos', 'Fechar', {
          duration: 2000,
        });
        throw error;
      }
    )
    );
  }

  deletar(id: string) {
    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.produtoService.deleteProduto(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Produto deletado com sucesso!',
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
              this.router.navigate(['/']);
            }
          });
          this.produto$ = this.produtoService.getProdutos();
        });
      }
    });

  }

  editar(id: string) {
    this.router.navigate(['editar', id], { relativeTo: this.activatedRoute });
  }
}

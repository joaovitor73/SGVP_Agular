import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../produto.service';
import { EmpresaService } from '../../Empresas/empresa.service';
import { Empresas } from '../../Empresas/empresas';
import { HeaderComponent } from '../../Shared/header/header.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, HeaderComponent],
  templateUrl: './criar-produto.component.html',
  styleUrls: ['./criar-produto.component.scss']
})
export class AddProdutoComponent implements OnInit {
  produtoForm: FormGroup;
  empresas: Empresas[] = [];
  produtoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private empresaService: EmpresaService
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0)]],
      quantidade: ['', [Validators.required, Validators.min(0)]],
      fornecedor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.empresaService.getEmpresas().subscribe((data: Empresas[]) => {
      this.empresas = data;
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.produtoId = params['id'];
        this.produtoService.getProdutoiD(this.produtoId!).subscribe(produto => {
          this.produtoForm.patchValue(produto);
        });
      }
    });
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      if (this.produtoId !== null) {
        this.produtoService.updateProduto(this.produtoId, this.produtoForm.value).subscribe(() => {
          Swal.fire({
            title: 'Produto atualizado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/produtos']);
        });
      } else {
        this.produtoService.addProduto(this.produtoForm.value).subscribe(() => {
          Swal.fire({
            title: 'Produto cadastrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/produtos']);
        });
      }
    }
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}

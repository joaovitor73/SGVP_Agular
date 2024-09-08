import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../empresa.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../Shared/header/header.component';
import { Empresas } from '../empresas';
import { ProdutoService } from '../../Produtos/produto.service';

@Component({
  selector: 'app-criar-empresa',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './criar-empresa.component.html',
  styleUrl: './criar-empresa.component.scss'
})
export class CriarEmpresaComponent {
  produtoForm: FormGroup;
  produtoId: number | null = null;
  empresas: Empresas[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private produtoService: ProdutoService
  ) {
    this.produtoForm = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.empresaService.getEmpresas().subscribe((data: Empresas[]) => {
      this.empresas = data;
    });

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.produtoId = +params['id'];
        this.produtoService.getProdutoiD(this.produtoId).subscribe(produto => {
          this.produtoForm.patchValue(produto);
        });
      }
    });
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      Swal.fire({
        title: 'Empresa cadastrada com sucesso!',
        icon: 'success',
        showConfirmButton: false,
        timer: 150
      });
      this.empresaService.addEmpresa(this.produtoForm.value).subscribe(() => {
        this.router.navigate(['/produtos']);
      });
    }
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}

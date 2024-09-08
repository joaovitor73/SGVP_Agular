import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AsyncPipe, Location, CommonModule } from '@angular/common';
import { Empresas } from '../empresas';
import { catchError, delay, Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importando ReactiveFormsModule e outros necessários
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../Shared/header/header.component';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatIconModule, MatTableModule, HeaderComponent, FormsModule, ReactiveFormsModule,CommonModule ], // Adicionando ReactiveFormsModule
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent {
  empresa$: Observable<Empresas[]>;
  empresas_array: Empresas[] = [];
  displayedColumns: string[] = ['nome', 'acao'];
  isEditing: boolean = false;
  empresaAtual: Empresas = { id: null, nome: '' }; // Inicializando com um objeto vazio
  produtoForm: FormGroup; // Definindo o FormGroup

  constructor(
    private httpClient: HttpClient,
    private empresaService: EmpresaService,
    public snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder // Injetando FormBuilder
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required]
    });

    empresaService.getEmpresas().subscribe(e => this.empresas_array = e);
    this.empresa$ = empresaService.getEmpresas()
      .pipe(delay(3000))
      .pipe(
        catchError(error => {
          this.snackBar.open('Erro ao carregar a lista de empresas', 'Fechar', {
            duration: 2000,
          });
          throw error;
        })
      );
  }

  adicionarEmpresa() {
    this.isEditing = true;
    this.empresaAtual = { id: null, nome: '' }; // Resetando o objeto para uma nova empresa
  }

  editar(id: string) {
    this.isEditing = true;
    this.empresaService.getEmpresa(id).subscribe(empresa => {
      this.empresaAtual = empresa;
      this.empresaAtual.id = id;
      this.produtoForm.patchValue(empresa); // Atualizando o formulário com os dados da empresa
    });
  }

  salvarEmpresa() {
    if (this.empresaAtual.id) {
      this.empresaService.updateEmpresa(this.empresaAtual.id, this.produtoForm.value).subscribe(() => {
        this.isEditing = false;
        this.empresa$ = this.empresaService.getEmpresas();
        Swal.fire({
          title: 'Empresa atualizada com sucesso!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload(); // Recarregar a página após a atualização
        });
      });
    } else {
      this.empresaService.addEmpresa(this.produtoForm.value).subscribe(() => {
        this.isEditing = false;
        this.empresa$ = this.empresaService.getEmpresas();
        Swal.fire({
          title: 'Empresa cadastrada com sucesso!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  }

  cancelar() {
    this.isEditing = false;
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
        this.empresaService.deleteEmpresa(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Empresa deletada com sucesso!',
          });
          this.empresa$ = this.empresaService.getEmpresas();
        });
      }
    });
  }

  voltar() {
    this.location.back();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/services/categories/response/GetCategoriesResponse';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
// onDestroy: é uma interface do Angular que permite que você limpe os recursos quando o componente for destruído
// OnInit: é uma interface do Angular que permite que você execute código quando o componente for inicializado

export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesData: Array<GetCategoriesResponse> = [];
  constructor(
    private CategoriesService: CategoriesService,
    private dialogServices: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router, // redirecionaro usuario para outras telas

  ){}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // limpar os recursos(chamadas do observable)
  }

  ngOnInit(): void{
    this.getAllCategories();

  }
  // Método responsável por buscar todas as categorias
  // e atribuir o resultado a variável categories
  // e exibir na tela
  getAllCategories(): void {
    this.CategoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesData = response;
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar categorias!',
            life: 3000
          });
          this.router.navigate(['/dashboard']); // redirecionar o usuario para a tela de dashboard
        }
      });
  }
}



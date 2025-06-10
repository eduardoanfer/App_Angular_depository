import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { deleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoriesAction';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/services/categories/response/GetCategoriesResponse';
import { CategoriesFormComponent } from '../../components/categories-form/categories-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: []
})
// onDestroy: é uma interface do Angular que permite que você limpe os recursos quando o componente for destruído
// OnInit: é uma interface do Angular que permite que você execute código quando o componente for inicializado

export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
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
  handleAddCategoryAction(event:EventAction): void {
    if(event){
      this.ref= this.dialogServices
      .open(CategoriesFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle:{overflow: 'auto'},
        baseZIndex: 10000,
        data: {
          event: event,
        }
    });
    this.ref.onClose
    .pipe(takeUntil(this.destroy$))
    .subscribe({next: () => this.getAllCategories(),}
    );
  }
}
  // Método usado por escutar a ação
  handleDeleteCategoryAction(event: deleteCategoryAction): void {
    if(event){
      this.confirmationService.confirm({
        message: `Você tem certeza que deseja deletar a categoria ${event?.name}?`,
        header: 'COnfirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCategory(event.category_id), // se o usuario clicar em sim
  })};
    }
    deleteCategory(category_id: string): void {

      if(category_id) {
        this.CategoriesService
          .deleteCategory({ category_id })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Categoria deletada com sucesso!',
                life: 3000
              });
              this.getAllCategories(); // atualizar a lista de categorias
            },
            error: (err) => {
              console.error(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao deletar categoria!',
                life: 3000
              });
            }
          });
    }
  }

}



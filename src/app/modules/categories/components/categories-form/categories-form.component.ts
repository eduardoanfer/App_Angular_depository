import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryEvent } from 'src/app/modules/enums/products/categories/CategoryEvent';
import { CreateCategoryRequest } from 'src/app/models/interfaces/categories/request/CreateCategoryRequest';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  // Eventos de ação
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formbuilder.group({
    name: ['', [Validators.required]],
  });

  constructor(
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private ref: DynamicDialogConfig,
    private categoriesService: CategoriesService,
  ) {}

  ngOnInit(): void {
    // Pega os dados recebidos pelo Dialog, contendo a ação (adicionar/editar)
    this.categoryAction = this.ref.data;

    // Se a ação for de editar, preenche o formulário com o nome da categoria
    if (this.categoryAction?.event?.action === this.editCategoryAction && this.categoryAction?.event?.categoryName) {
      this.setCategoryName(this.categoryAction.event.categoryName);
    }
  }

  // Define o nome da categoria no formulário
  setCategoryName(categoryName: string): void {
    if (categoryName) {
      this.categoryForm.setValue({
        name: categoryName,
      });
    }
  }

  // Executa a ação de Adicionar ou Editar
  handleSubmitCategoryAction(): void {
    if (this.categoryAction?.event?.action === this.addCategoryAction) {
      this.handleSubmitAddCategory();
    } else if (this.categoryAction?.event?.action === this.editCategoryAction) {
      this.handleSubmitEditCategory();
    }
    return
  }

  // Lógica para Adicionar uma nova categoria
  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const requestCreateCategory: CreateCategoryRequest = {
        name: this.categoryForm.value.name as string,
      };

      this.categoriesService
        .createCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Categoria criada com sucesso!',
                life: 3000
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar categoria!',
              life: 3000
            });
          }
        });
    }
  }

  // Lógica para Editar uma categoria existente
  handleSubmitEditCategory(): void {
    if (
      this.categoryForm?.value &&
      this.categoryForm?.valid &&
      this.categoryAction?.event?.id
    ) {
      const requestEditCategory: { name: string; category_id: string } = {
        name: this.categoryForm?.value?.name as string,
        category_id: this.categoryAction?.event?.id,
      };

      // Certifique-se de que editCategoryName retorna um Observable
      this.categoriesService
        .editCategoryName(requestEditCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria editada com sucesso!',
              life: 3000,
            });
          },
          error: (err) => {
            console.error(err);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar categoria!',
              life: 3000,
            });
          },
        });
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

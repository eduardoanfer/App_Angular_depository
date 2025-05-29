import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { CreateCategoryRequest } from 'src/app/models/interfaces/categories/request/CreateCategoryRequest';
import { CategoryEvent } from 'src/app/modules/enums/products/categories/CategoryEvent';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION; // evento de adicionar categoria
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION; // evento de adicionar categoria

  public categoryAction!: {event: EditCategoryAction}; // Aqui eu crio uma propriedade para receber o produto que foi clicado
  public categoryForm= this.formbuilder.group({
    name: ['', [Validators.required]],

  });
  public addCategoryForm= this.formbuilder.group({
    name: ['', [Validators.required]],

  });
  constructor(
    private formbuilder: FormBuilder,
    private messageService: MessageService,
    private ref: DynamicDialogConfig,
    private categoriesService: CategoriesService,
  ){}

<<<<<<< Updated upstream
  ngOnInit(): void {
    this.categoryAction = this.ref.data; // aqui eu pego a categoria que foi clicada

    const event = this.categoryAction?.event;

    if (event?.action === this.editCategoryAction && event?.categoryName != null) {
      this.setCategoryName(event.categoryName);
    }
  }

=======
  ngOnInit():void{

  }
>>>>>>> Stashed changes
  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid){
      const requestCreateCategory: {name: string} = {
        name: this.categoryForm?.value.name as string,
    };
    this.categoriesService
      .createCategory(requestCreateCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response)
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria criada com sucesso!',
              life: 3000
            });
        }
      });
    } else {
      this.categoryForm.reset();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao criar categoria!',
        life: 3000
      });
    }
  }
<<<<<<< Updated upstream
  handleSubmitCategoryAction(): void {

  }
  setCategoryName(categoryName: string): void {
   if (categoryName && categoryName !== '') {
    this.categoryForm.setValue({
      name: categoryName,
    });
   }
  }
=======
>>>>>>> Stashed changes

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // limpar os recursos(chamadas do observable)
  }
}

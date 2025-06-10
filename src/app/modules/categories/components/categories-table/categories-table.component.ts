import { Component, EventEmitter, Input, Output } from '@angular/core';
import { deleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoriesAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { CategoryEvent } from 'src/app/modules/enums/products/categories/CategoryEvent';
import { GetCategoriesResponse } from 'src/app/services/categories/response/GetCategoriesResponse';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: []
})
export class CategoriesTableComponent {
// input responsável por receber os dados da sua Componente pai os elementos da categoria
@Input() public categories: Array<GetCategoriesResponse> = [];
@Output() public categoryEvent = new EventEmitter<EditCategoryAction>(); // ai colocar o tipo de evento que vai ser emitido
@Output() public deleteCategoryEvent = new EventEmitter<deleteCategoryAction>(); // evento de deletar categoria
// input responsável por receber o id da categoria
public categorySelected!: GetCategoriesResponse;
public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION; // evento de adicionar categoria
public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION; // evento de editar categoria
public deleteCategoryAction = CategoryEvent.DELETE_CATEGORY; // evento de deletar categoria
// metodo responsável por emitir o evento de adicionar categoria

handleDeleteCategoryEvent(categories_id: string, categoryName: string): void {
 if(categories_id !== '' && categoryName !== '') {
     this.deleteCategoryEvent.emit ({
      category_id: categories_id,
      name: categoryName
     })
 }
}
handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
  if (action && action !== '') {
    this.categoryEvent.emit({
      action, id , categoryName
    });
  }


}
}



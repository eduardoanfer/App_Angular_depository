import { Component, EventEmitter, Input, Output } from '@angular/core';
import { deleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoriesAction';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
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
// input responsável por receber o id da categoria
public categorySelected!: GetCategoriesResponse;
public addCategoryAction = this.categoryEvent
}



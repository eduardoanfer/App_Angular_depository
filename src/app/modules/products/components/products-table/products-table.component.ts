import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/request/response/GetAllProductsResponse';
import { ProductEvent } from 'src/app/modules/enums/products/ProductEvent';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {
  @Input()
  products: Array<GetAllProductsResponse> = []; // tera a função de receber os produtos
  @Output()
  productEvent = new EventEmitter<string>(); // tera a função de emitir o evento para o componente pai

  public productSelected!: GetAllProductsResponse; // Produto selecionado
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT; // Evento para adicionar produto
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT; // Evento para editar produto
  public saleProductEvent = ProductEvent.SALE_PRODUCT_EVENT; // Evento para vender produto
  
  // Método para selecionar um produto
  handleProductEvent(action : string, id?: String ): void {
    if(action && action !== ''){
      const ProductEventData = id && id !== '' ?{ action, id } : { action }; // se o id for diferente de vazio e diferente de undefined, ele vai buscar o produto pelo id
      //EMITIR  O VALOR DO EVENTO
      this.productEvent.emit(ProductEventData.action); // Emite o evento para o componente pai

    }
}
}

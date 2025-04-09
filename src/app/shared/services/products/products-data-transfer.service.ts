import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/request/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

  public producstDataEmitter$ =new BehaviorSubject <Array<GetAllProductsResponse> | null >(null ) // aqui crio um observable que vai emitir os dados do produto, o valor inicial é null
  // o valor inicial é null porque quando o usuario entra na tela de detalhes do produto, ele não tem nenhum produto selecionado
  // ou o produto ou null
  public productsDatas: Array <GetAllProductsResponse> = [];

  setProductsData(products : Array<GetAllProductsResponse>): void {
    // se recebemos dados do produto, emitimos os dados
    if (products){
      this.producstDataEmitter$.next(products); // aqui emitimos os dados do produto
      this.getProductsDatas();

    }
  }

}

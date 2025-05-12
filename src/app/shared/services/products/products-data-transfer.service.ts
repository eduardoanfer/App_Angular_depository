import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  getProductsData() {
    throw new Error('Method not implemented.');
  }
  public producstDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null); // Observable que emite os dados dos produtos
  public productsDatas: Array<GetAllProductsResponse> = []; // Array para armazenar os produtos filtrados

  setProductsData(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.producstDataEmitter$.next(products); // Emite os dados dos produtos
      this.getProductsDatas(); // Atualiza os dados dos produtos
    }
  }

  getProductsDatas(): Array<GetAllProductsResponse> {
    this.producstDataEmitter$
      .pipe(
        take(1), // Pega apenas o primeiro valor emitido
        map((data) =>
          data ? data.filter((product) => product.amount > 0) : [] // Filtra os produtos com amount > 0
        )
      )
      .subscribe({
        next: (response) => {
          if (response?.length > 0) {
            this.productsDatas = response; // Atribui os produtos filtrados ao array
            console.log('Dados dos Produtos:', this.productsDatas); // Log dos produtos
          }
        },
        error: (err) => {
          console.error('Erro ao obter os dados dos produtos:', err); // Log de erro
        },
      });

    return this.productsDatas; // Retorna o array de produtos
  }
}

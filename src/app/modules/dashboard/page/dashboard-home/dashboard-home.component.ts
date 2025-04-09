import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/request/response/GetAllProductsResponse';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [] ,
})
export class DashboardHomeComponent implements OnInit {
 public productslList: Array<GetAllProductsResponse> = []; // vai me retornar um array de produtos


  constructor(
    private productsService: ProductsService,
    private  messageService: MessageService
  ){}

  ngOnInit(): void {
    this.getAllProducts();
  }
  // obs: é void porque de fato eu não preciso retornar nada.
  getAllProducts(): void {
    this.productsService
    .getAllProducts()
    .subscribe({
      // validando os produtos de resposta.
      next: (response) => {
        if (response && response.length > 0) {
          this.productslList = response; // response é o array de produtos
          console.log('Dados dos Produtos', this.productslList);
        }else {
          console.log('Nenhum produto encontrado');
        }
      }, error: (error) => {
        console.log('Erro ao carregar os Produtos',error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao carregar produtos',
          detail: "Erro ao carregar produtos",
          life: 2500,
        });
      }
    });
  };
}

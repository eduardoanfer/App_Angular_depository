import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/products-table/product-form/product-form.component';
import { Overlay } from 'primeng/overlay';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private ref!: DynamicDialogRef;
  public productsDatas: GetAllProductsResponse[] = [];

  constructor(
    private productService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService

  ) {
    this.getServiceProductsDatas(); // Chama o método para buscar os dados dos produtos
  }

  getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsDatas();

    if (productsLoaded.length > 0) {
      console.log('Dados de Produtos', this.productsDatas);
      this.productsDatas = productsLoaded;
     } else
      this.getAPIProductsDatas();


  }

  getAPIProductsDatas():void {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            //this.productsDtService.setProductsData(this.productsDatas);
            console.log('Dados de Produtos carregados da API:', this.productsDatas);
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos!',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }
  // atraves desse metodo conseguimos abrir o modal que é do produto
  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref= this.dialogService
      .open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle:{Overflow:'auto'},
        baseZIndex: 10000,
        maximizable: true, // permite maximizar o modal
        data: {
          productDatas: this.productsDatas,
          event: event,
        }
        // dados utilizados para recuperar o produto
      });
      //takeuntil é utilizado para cancelar a subscrição quando o componente é destruído
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.getAPIProductsDatas(),})
    }
  }
  handleDeleteProduct(event: {
    product_id: string;
    product_Name: string;
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Você tem certeza que deseja excluir o produto ${event.product_Name}?`,
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id ),
        });
      }

  }
  deleteProduct(product_id: string) {
    if (product_id){
      this.productService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response){
            this.messageService.add({
              severity: ' sucess',
              summary : ' Sucesso',
              detail: `Produto removido com sucesso !`,
              life: 2500,
            });
            this.getAPIProductsDatas();
          }
         }, error : (err) =>{
            console.log(err);
            this.messageService.add({
              severity :'error',
              summary : 'Erro',
              detail: 'Erro ao remover produto !',
              life: 2500,
            })

          }
      })

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
     // Protegido com optional chaining
  }
}

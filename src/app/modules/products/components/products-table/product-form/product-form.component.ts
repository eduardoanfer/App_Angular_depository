import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductEvent } from 'src/app/modules/enums/products/ProductEvent';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/services/categories/response/GetCategoriesResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name: string; code: string} >= [];
  public productAction!:{
    event: EventAction;
    productsDatas:  Array<GetAllProductsResponse>;
  }; // Aqui eu crio uma propriedade para receber o produto que foi clicado
  public productsDatas: Array<GetAllProductsResponse> = [];
  public productSelectedDatas!: GetAllProductsResponse; // do tipo do produto que foi clicado

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;


  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref : DynamicDialogConfig // ele é o ref do dialog, que é o que vai
    //  abrir o modal ( Puxar os dados do produto para editar, por exemplo)
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data; // Aqui eu pego o produto que foi clicado
    if (
      this.productAction?.event?.action === this.addProductAction &&
      this.productAction?.productsDatas) {
      // se for opção de editar e se tiver produtos
      this.getProductSelectedDatas(this.productAction?.event?.id as string);
    }
   this.productAction?.event?.action === this.saleProductAction &&
    this.getProductDatas();

    this.getAllCategories();
}

  getAllCategories(): void {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response; // response aqui é nosso array de categorias
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if(this.addProductForm.valid && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      // Por exemplo, enviar os dados para o servidor ou exibir uma mensagem de sucesso
      };
      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$)) // Chama o método createProduct do serviço
        // e passa o objeto requestCreateProduct como parâmetro
        .subscribe({
          next: (response) => {
            if(response){
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso!'
            });
          }
          },
          error: (error) => {
            console.error('Erro ao criar produto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível criar o produto.',
            life:2500,
            });
          },
        });
    }
    this.addProductForm.reset(); // Limpa o formulário após o envio
  }

   handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id,
        amount: this.editProductForm.value.amount as number,
      };
      // Aqui eu faço a chamada para o serviço de editar produto
      // e passo o objeto requestEditProduct como parâmetro
      //ex : this.productsService
      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editProductForm.reset();
          },
        });
    }
   }
  getProductSelectedDatas(product_id: string): void{
    const allProducts = this.productAction?.productsDatas; // é um array de produtos

    if(allProducts.length > 0){
      const productFiltered = allProducts.filter((product) => product.id === product_id);
    if(productFiltered){
      this.productSelectedDatas = productFiltered[0]; // no index 0
      // Aqui eu pego o produto que foi clicado e coloco no formulário
      this.editProductForm.setValue({
        name: this.productSelectedDatas?.name,
        price: this.productSelectedDatas?.price,
        amount: this.productSelectedDatas?.amount,
        description: this.productSelectedDatas?.description,
      });
    }
  }
  }
  //Buscar os dados armazenados em memória ( VAMOS BUSCAR NA api E SETAR NA MEMÓRIA DEPOIS DA BUSCA)
  getProductDatas(): void {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productsDatas = response;
          this.productsDatas &&
          this.productsDtService.setProductsData(this.productsDatas); // Aqui eu seto os dados na memória
        }
      },
  })
  }


ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
}

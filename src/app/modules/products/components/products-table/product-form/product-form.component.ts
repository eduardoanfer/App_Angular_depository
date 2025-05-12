import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/services/categories/response/GetCategoriesResponse';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name: string; code: string} >= [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        error: (error) => {
          console.error('Erro ao buscar categorias:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar as categorias.'
          });
        }
      });
  }

  handleSubmitAddProduct(): void {
    if(this.addProductForm.valid && this.addProductForm?.valid) {
      // Aqui posso fazer  o que quiser com os dados do formulário
      // Por exemplo, enviar os dados para o servidor ou exibir uma mensagem de sucesso
      const requestCreateProduct : CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as unknown as number,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: this.addProductForm.value.amount as number,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

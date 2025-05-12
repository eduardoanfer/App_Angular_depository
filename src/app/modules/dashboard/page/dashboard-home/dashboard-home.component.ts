import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from  'src/app/models/interfaces/products/response/GetAllProductsResponse'; ;
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // Usado para fazer o unsubscribe automático
  public productsList: Array<GetAllProductsResponse> = []; // Lista com os produtos retornados da API

  public productsChartDatas!: ChartData; // Dados do gráfico no formato esperado pelo Chart.js
  public productsChartOptions!: ChartOptions; // Configurações de estilo/opções do gráfico

  constructor(
    private productsService: ProductsService, // Service responsável por buscar os produtos
    private messageService: MessageService, // Service para exibir mensagens toast
    private productsDtService: ProductsDataTransferService // Service para compartilhar dados com outros componentes
  ) {}

  ngOnInit(): void {
    this.getProductsDatas(); // Ao iniciar o componente, buscar os dados dos produtos
  }

  getProductsDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$)) // Faz unsubscribe quando o componente for destruído
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsList = response; // Atualiza a lista local com os dados da API
            this.productsDtService.setProductsData(this.productsList); // Compartilha os dados com outros componentes
            this.setProductsChartConfig(); // Gera os dados e opções do gráfico com base nos produtos recebidos
          }
        },
        error: (err) => {
          console.log(err); // Log de erro no console
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos!',
            life: 2500,
          });
        },
      });
  }

  setProductsChartConfig(): void {
    if (this.productsList.length > 0) {
      // Pega os estilos definidos no CSS da aplicação
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color').trim();
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary').trim();
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border').trim();

      // Define os dados do gráfico com os nomes e quantidades dos produtos
      this.productsChartDatas = {
        labels: this.productsList.map((element) => element?.name),
        datasets: [
          {
            label: 'Quantidade',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400').trim(),
            borderColor: documentStyle.getPropertyValue('--indigo-400').trim(),
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500').trim(),
            data: this.productsList.map((element) => element?.amount),
          },
        ],
      };

      // Define as opções de exibição do gráfico
      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor, // Cor dos rótulos da legenda
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: '500', // Define espessura da fonte
              },
            },
            grid: {
              color: surfaceBorder, // Cor da linha do grid no eixo X
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder, // Cor da linha do grid no eixo Y
            },
          },
        },
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emite o sinal para destruir a inscrição
    this.destroy$.complete(); // Completa o Subject
  }
}

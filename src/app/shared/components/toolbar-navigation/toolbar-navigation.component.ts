import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from 'src/app/modules/products/components/products-table/product-form/product-form.component';
import { max } from 'rxjs';
import { ProductEvent } from 'src/app/modules/enums/products/ProductEvent';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
})
export class ToolbarNavigationComponent {

  constructor(private cookie: CookieService, private router: Router, private dialogService: DialogService ){}
 // vous criar um metodo para verirficar se o usuario esta logando com o cookie
  handleLogout () : void {
    this.cookie.delete('USER_INFO');
    this.router.navigate(['/home']); // Redireciona para a página inicial
    // Exibe mensagem de sucesso
  };
  handleSaleProduct(): void {
    // Aqui você pode implementar a lógica para efetuar a venda do produto
    // Por exemplo, redirecionar para uma página de venda ou abrir um modal
    this.dialogService.open(ProductFormComponent,{
      header: ProductEvent.SALE_PRODUCT_EVENT,
      width: '70%',
      contentStyle: { overflow: 'auto'},
      baseZIndex: 10000, // Z-index para garantir que o modal fique acima de outros elementos
      maximizable: true, // Permite maximizar o modal
  });

}
}

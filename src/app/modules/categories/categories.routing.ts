import { Routes } from "@angular/router";
import { CategoriesHomeComponent } from "./page/categories-home/categories-home.component";
//"CATEGORIES_ROUTES" é uma constante que armazena um array de objetos de rota.
export const CATEGORIES_ROUTES : Routes = [
  {
    path: '',
    component: CategoriesHomeComponent
  }
]; // Cada objeto de rota define um caminho e
// o componente que deve ser carregado quando esse caminho é acessado.

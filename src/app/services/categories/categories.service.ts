import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environments } from 'src/app/environments/environments';
import { GetCategoriesResponse } from './response/GetCategoriesResponse';
import { Observable } from 'rxjs';
import { CreateCategoryRequest } from 'src/app/models/interfaces/categories/request/CreateCategoryRequest';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  createCategory(requestDatas: CreateCategoryRequest): Observable<CreateCategoryRequest> {
    return this.http.post<CreateCategoryRequest>(
      `${this.API_URL}/category`, // aqui coloco a url do backend (rota) para criação de produto
      requestDatas, // esse aqui é meu parametro de entrada, que é o que eu espero receber
      this.htttpOptions // que é o meu objeto criado.
    );
    throw new Error('Method not implemented.');
  }
  private API_URL = environments.API_URL; // URL da API
  private JWT_TOKEN = this.cookie.get('USER_INFO') || ''; // aqui pego o cookie que foi salvo no login ( para o token jwt)
  private htttpOptions = {
    headers: new HttpHeaders({
      'CONTENT-TYPE': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}` ,// aqui pego o cookie que foi salvo no login ( para o token jwt)

    }),
  };

  constructor(
    private http: HttpClient,
    private cookie: CookieService,

  ){}
  getAllCategories() : Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`, // aqui coloco a url do backend (rota)
      this.htttpOptions
    );
    }
  // ao fazer uma chamada http, o que espero receber é um Observable, então coloco o tipo de retorno do Observable ( para me inscrever)
  deleteCategory(requestDatas:{category_id: string}): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/category/delete`,{ // aqui coloco a url do backend (rota)
        ...this.htttpOptions, params:{
            category_id: requestDatas?.category_id
          },
        }
    );

  }
  editCategoryName(requestDatas: {
    name: string;
    category_id: string;
  }): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`,
      { name: requestDatas?.name },
      {
        ...this.htttpOptions, params:{
          category_id: requestDatas?.category_id
        },
      }
    );
  }
}

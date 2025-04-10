import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environments } from 'src/app/environments/environments';
import { GetCategoriesResponse } from './response/GetCategoriesResponse';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
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
}

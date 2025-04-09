import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environments } from 'src/app/environments/environments';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/request/response/GetAllProductsResponse';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environments; // URL da API
  private JWT_TOKEN = this.cookie.get('USER_INFO') || ''; // aqui pego o cookie que foi salvo no login ( para o token jwt)
  private httpOptions={
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}` // aqui pego o cookie que foi salvo no login ( para o token jwt)
    }), // so mostro produtos para quem está logado e o token é o que me diz se o usuario está logado ou não
  };
  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  )
  {}
  getAllProducts(): Observable<Array<GetAllProductsResponse>> {

     return this.http.get<Array<GetAllProductsResponse>>(
        `${this.API_URL.API_URL}/products`, // aqui coloco a url do backend (rota)
        this.httpOptions
    )
    // conseguimos operar dados da forma que quiser, então podemos fazer um pipe aqui o pipe tem vários operadores.
    .pipe(map((products)=>products.filter((data) => data?.amount > 0))); // Filtra produtos com amount > 0

  } // ao fazer uma chamada http, o que espero receber é um Observable, então coloco o tipo de retorno do Observable ( para me inscrever)
}


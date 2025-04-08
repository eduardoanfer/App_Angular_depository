import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environments } from 'src/app/environments/environments';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';

@Injectable({
  providedIn: 'root', // esse serviço pode ser usado em qualquer classe, mas se quizer colocar em somente uma especifica tenho que colocar nela.
})
export class UserService {
  private API_URl = environments.API_URL; // localhost:3000

  constructor(private http: HttpClient, private cookie: CookieService) { }
  // Criar nosso servico de criar usuario  depois do Observable eu coloco o tipo de retorno que espero
  // o tipo de retorno é o que vem do backend, então crio uma interface para isso
  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(
      `${this.API_URl}/user`, // Certifique-se de que a URL está correta
      requestDatas
    );
  }

  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
        `${this.API_URl}/auth`,
        requestDatas // aqui colocamos o que vamos enviar para o backend

      );

    }
    isLoggedIn(): boolean {
      const JWT_TOKEN = this.cookie.get('USER_INFO'); // aqui pego o cookie que foi salvo no login ( para o token jwt)
      return JWT_TOKEN ? true : false; // se o token existir, o usuario está logado ":" - se não

    } // preciso saber se usuario logado true ou false / se apresenta um token ou um cookie na sua aplicação
}

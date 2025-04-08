import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) { }
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


}

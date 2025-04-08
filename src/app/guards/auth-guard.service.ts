import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // Método para verificar se o usuário pode acessar a rota
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.userService.isLoggedIn()) {
      // Redireciona para a página de login se o usuário não estiver logado
      this.router.navigate(['/home']);
      return false;
    }
    // Permite o acesso se o usuário estiver logado
    return true;
  }
}

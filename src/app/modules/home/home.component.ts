import { Conditional } from '@angular/compiler';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder} from '@angular/forms'; // Adicionado FormBuilder
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginCard = true; // fazendo uma logica para o outro card somente aparecer quando sair do outro card

  //Formulário de login
    loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]], // Validação de email
    password: ['', Validators.required], // Campo obrigatório
  });


  // formulário de cadastro
  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]], // Adicionado Validators.email para validação de email
    password: ['', Validators.required],
  }); // criando o formulario reativo de signup , é um objeto ({}), [] é um array

  // trabalhar com formularios reativos
  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService, // importando o servico de usuario
    private cookieService: CookieService, // importando o cookie service
    private  messageService: MessageService, // importando o message service   o message service é um serviço do primeng que serve para mostrar mensagens de sucesso ou erro
    private router: Router,



  ) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token); // Salva o token no cookie
            this.loginForm.reset(); // Reseta o formulário
            this.router.navigate(['/dashboard']); // Redireciona para o dashboard assim que o login for bem-sucedido
            // Exibe mensagem de sucesso
            this.messageService.add({
              severity: 'success',
              summary: 'Login realizado com sucesso!',
              detail: `Bem-vindo(a) de volta ${response.name}`,
              life: 2000, // Tempo que a mensagem ficará na tela
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no login',
            detail: 'Verifique suas credenciais e tente novamente.',
            life: 2000,
          });
        },
      });
    }
  }
  // Método para envio do formulário de cadastro
  onSubmitSignupForm(): void {
    if (this.signupForm.valid) {
      this.userService.signupUser(this.signupForm.value as SignupUserRequest).subscribe({
        next: (response) => {
          if (response) {
            alert('Usuário cadastrado com sucesso!');
            this.signupForm.reset(); // Reseta o formulário
            this.loginCard = true; // Volta para o card de login
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no cadastro',
            detail: 'Verifique os dados e tente novamente.',
            life: 2000,
          });
        },
      });
    }
  }
}

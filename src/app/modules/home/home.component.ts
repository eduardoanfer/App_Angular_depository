import { Conditional } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
// Adicionado FormBuilder
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit{
  @ViewChild('emailInput') public emailInputRef!: ElementRef; // Referência ao input de email ( vai procurar o elemento no DOM por esse nome, que é o nome que dei no html )
  @ViewChild('PasswordInput') public passwordInputRef!: ElementRef; // Referência ao input de senha // esses dois seram definidos no ngafterviewinit, pois o angular ainda não criou os elementos do html, então não consigo pegar a referencia deles antes disso
  private destroy$ = new Subject<void>();
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
  ngAfterViewInit(): void {
    // Aqui você pode adicionar lógica que precisa ser executada após a visualização do componente
    this.emailInputRef.nativeElement.value = 'Seu email aki'; // Reseta o valor do input de email
    this.passwordInputRef.nativeElement.value = 'Sua senha aki'; // Reseta o valor do input de senha
    console.log("Email Input Reference =>", this.emailInputRef.nativeElement.value);
    console.log("Password Input Reference =>", this.passwordInputRef.nativeElement.value);
  }

  onSubmitLoginForm(): void {
    if (this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$) // Fazendo o unsubscribe do observable - o takeuntil é um operador do rxjs que faz o unsubscribe do observable quando o componente é destruído e ele vai receber um subject que criei ali encima que vai emitir um valor quando o componente for destruído
      )
      .subscribe({
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
      this.userService.signupUser(this.signupForm.value as SignupUserRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
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
  //evitar vazamento de memoria
  ngOnDestroy(): void {
    this.destroy$.next(); // Emite um valor para o subject
    this.destroy$.complete(); // Completa o subject
  }


}

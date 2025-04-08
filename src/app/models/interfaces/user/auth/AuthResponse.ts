export interface AuthResponse {
  id: string; // id do usuario
  name: string; // nome do usuario
  email: string; // email do usuario
  token: string; // token do usuario ->  aqui colocamos o token que é o que vai autenticar o usuario
} // o que vem do backend

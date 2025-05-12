export interface GetAllProductsResponse {
  id: string; // id do produto
  name: string; // nome do produto
  amount: number;
  price: string; // preco do produto
  //category é um objeto que dentro dela tem as propriedades
  category: {
    id: string; // id da categoria
    name: string; // nome da categoria
  }
}

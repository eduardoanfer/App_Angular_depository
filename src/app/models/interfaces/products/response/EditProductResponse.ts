export interface EditProductRequest {
  id: string; // id do produto
  name: string; // nome do produto
  price: string; // preco do produto
  amount: number; // quantidade do produto
  description: string; // descricao do produto
  product_id: string; // id da categoria
}

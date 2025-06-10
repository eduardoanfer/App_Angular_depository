import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, args: number): string {
    // se a descrição for muito longa, corta ela para o tamanho máximo e coloca os pontinhos
    if (!value) {
      return value.length > args ? value.substring(0, args) + '...' : value;
    }
    return '';
  }
}

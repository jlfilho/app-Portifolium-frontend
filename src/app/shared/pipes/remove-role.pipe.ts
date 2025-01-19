import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeRole'
})
export class RemoveRolePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(/^ROLE_/, ''); // Remove o prefixo ROLE_ do início da string
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breaklines',
  standalone: true
})
export class BreaklinesPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
}



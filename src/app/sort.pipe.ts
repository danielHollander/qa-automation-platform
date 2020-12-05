import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { orderBy } from 'lodash';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any[], order: any, column: string = '') {
    if (typeof value != "undefined") {
      if (order == 'asc')
        return value.sort((a, b) => (a[column][0] > b[column][0]) ? 1 : ((b[column][0] > a[column][0]) ? -1 : 0));
      else
        return value.sort((a, b) => (b[column][0] > a[column][0]) ? 1 : ((a[column][0] > b[column][0]) ? -1 : 0));
    }
  }
}


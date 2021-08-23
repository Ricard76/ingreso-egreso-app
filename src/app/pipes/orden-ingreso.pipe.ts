import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    console.log( 'items to order:', items);
    let itemsToSort = [...items];
    
    return itemsToSort.sort( (a, b) => {
      if( a.tipo == 'ingreso'){
        return -1
      } else {
        return 1;
      }
    });
  }

}

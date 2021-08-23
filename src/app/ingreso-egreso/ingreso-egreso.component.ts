import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as uiActions from '../share/ui.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(  private fb: FormBuilder,
                private IngresoEgresoService: IngresoEgresoService,
                private store: Store<AppState>) { }

  ngOnInit(): void {

    this.loadingSubs = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required], 
      monto: ['', Validators.required]
    });

  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe();
  }

  guardar(){

/*    
    setTimeout( () => {
      //Cancelar loading
    }, 2500);
*/

    if (this.ingresoForm.invalid){ return; }

    this.store.dispatch( uiActions.isLoading () );

    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo);

    this.IngresoEgresoService.crearInresoEgreso( ingresoEgreso )
      .then( () => {
        this.ingresoForm.reset();
        this.store.dispatch( uiActions.stopLoading() );
        //Swal.fire('Registro creado', descripcion, 'success')
      })
      .catch( (error) => {
        this.store.dispatch( uiActions.stopLoading() );
        Swal.fire('Error', error.message, 'error')
      });
  }

}

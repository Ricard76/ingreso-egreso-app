import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as IngresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosEgresosSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( ({user}) => {
        this.ingresosEgresosSubs = this.ingresoEgresoService.initEngresosEgresosListener( user.uid )
          .subscribe( ingresosEgresosFB => {

            this.store.dispatch( IngresoEgresoActions.setItems( { items: ingresosEgresosFB }) );

          });
      })
  }

  ngOnDestroy(){
    this.ingresosEgresosSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }



}

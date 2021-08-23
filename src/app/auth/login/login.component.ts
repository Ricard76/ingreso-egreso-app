import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../share/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder, 
               private auth: AuthService,
               private router: Router, 
               private store: Store<AppState>) { }

  ngOnInit(): void{
    this.loginForm = this.fb.group({
      email:    ['', [Validators.email, Validators.required]], 
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe( ui => {
        this.cargando = ui.isLoading;
      });
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  loguearUsuario(){

    if (this.loginForm.invalid){ return; }
    
    this.store.dispatch( ui.isLoading() );

   /* Swal.fire({
      title: 'Credenciales válidas',
      html: 'Cargando aplicación <b></b>.',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    */
    const { email, password } = this.loginForm.value;
    this.auth.loguinUsuario( email, password )
      .then( registro => {
        //Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['']);
      })
      .catch( error => {

        this.store.dispatch( ui.stopLoading() );        

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        });

      });            

  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../../share/ui.actions';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder, 
               private authService: AuthService, 
               private router: Router,
               private store: Store<AppState> ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required ],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select( 'ui')
        .subscribe( ui => this.cargando = ui.isLoading );

  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if (this.registroForm.invalid){ return; } 

    this.store.dispatch( ui.isLoading() );

    /*Swal.fire({
      title: 'Guardando datos...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });*/

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario( nombre, correo, password)
      .then( (credenciales) => { 
        //Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['']);
      })
      .catch( error => {

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        });

      });
    
  }

}

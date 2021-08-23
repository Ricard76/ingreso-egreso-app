import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private fb: FormBuilder, 
               private auth: AuthService,
               private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.email, Validators.required]], 
      password: ['', Validators.required]
    })
  }

  loguearUsuario(){

    if (this.loginForm.invalid){ return; }
    
    Swal.fire({
      title: 'Credenciales válidas',
      html: 'Cargando aplicación <b></b>.',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const { email, password } = this.loginForm.value;
    this.auth.loguinUsuario( email, password )
      .then( registro => {
        Swal.close();
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

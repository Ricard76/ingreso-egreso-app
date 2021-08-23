import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ThemeService } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombreUsuario: String = '';
  userSubs: Subscription;

  constructor( private authService: AuthService,
               private router: Router, 
               private store: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(
      filter( ({user}) => user != null)
    )
    .subscribe( ({user}) => {
      this.nombreUsuario = user.nombre
    });
  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();
  }

  logout(){

    Swal.fire({
      title: 'Cerrando sesión...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.logout()
    .then( () => {
      Swal.close();
      this.router.navigate(['/login']);
    })
  }
}

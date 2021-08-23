import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore:AngularFirestore, 
                private authService: AuthService) { }

  crearInresoEgreso( ingresoEgreso: IngresoEgreso){
    const uid = this.authService.user.uid;
    delete ingresoEgreso.uid;
    return this.firestore.doc(`${ uid }/ingresos-egresos`)
      .collection('items')
      .add({ ... ingresoEgreso});

  }

  initEngresosEgresosListener( uid: string){
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
    .snapshotChanges() // ->devuelve un objeto con más información
    //.valueChanges()     ->devuelve valores
    .pipe( 
          /* 
        map( snapshot => {
          console.log('snapshot:', snapshot);
          return snapshot.map( doc => {
            return {
              uid: doc.payload.doc.id, 
              ...doc.payload.doc.data() as any
            }
          });*/
          //Código de arriba simplificado
          map( snapshot => snapshot.map( doc => ({
                uid: doc.payload.doc.id, 
                ...doc.payload.doc.data() as any
                })
             )
          )
    )
  }


  borrarIngresoEgreso( uidItem: String ){
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }

}



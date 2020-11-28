import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirecloudService {

  constructor(private fireStore: AngularFirestore) { }
  readonly collectionName = 'usuarios';

  LeerUsuarios()  {
    return this.fireStore.collection(this.collectionName).snapshotChanges();
  }

  public create(user) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.collectionName).add(user).then(rest => { }, err => reject(err));
    });
  }

  public nuevaCarga(user: string, monto: Array<number>) {
    let creditos = this.fireStore.collection('creditos').doc(user);
    // Set the "capital" field of the city 'DC'
    console.log(creditos);
    return creditos.set({
      cargas: monto
    })
    .then(function() {
      console.log("Documento Actualizado!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error actualizando doc: ", error);
    });

  }


  readCollection(collection: string) {
    return this.fireStore.collection(collection).snapshotChanges();
  }

}

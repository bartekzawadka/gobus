import { Injectable } from '@angular/core';
import {AlertButton, AlertController} from "ionic-angular";

/*
  Generated class for the ErrorDialogProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ErrorDialogProvider {

  constructor(public alertCtrl: AlertController) {
  }

  showMessage(title: string, message: string) : Promise<any>{
    return this.show(title, message);
  }

  showError(message: string, title: string = 'Error') : Promise<any>{
    return this.show(title, message);
  }

  showConfirm(
    title: string,
    message: string,
    confirmButtonText: string = "OK",
    cancelButtonText: string = "Cancel") : Promise<any>{
    return this.show(title, message, [{
      role: 'cancel',
      text: cancelButtonText
    },{
      text: confirmButtonText
    }]);
  }

  private show(title: string, message: string, buttons: (AlertButton | string)[] = ['OK']) : Promise<any>{
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: buttons
    });

    return alert.present();
  }
}

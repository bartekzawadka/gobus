import { Component } from '@angular/core';
import {NavController, Toast, ToastController} from 'ionic-angular';
import {TimetableProvider} from "../../providers/timetable/timetable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private connectionErrorToast: Toast;

  constructor(
    public navCtrl: NavController,
    public timetableProvider: TimetableProvider,
    public toastCtrl: ToastController) {
    this.connectionErrorToast = this.toastCtrl.create({
      dismissOnPageChange: true,
      message: "Connection failed",
      position: 'top'
    });
  }

  ionViewDidEnter(){

  }
}

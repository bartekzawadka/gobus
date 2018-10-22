import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {HomePage} from "../home/home";

/**
 * Generated class for the ChooseBusStopNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-bus-stop-number',
  templateUrl: 'choose-bus-stop-number.html',
})
export class ChooseBusStopNumberPage {

  private readonly busStopId: number;
  selectedNumber: string;
  busNumbers = [
    '01',
    '02'
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public configSrv: ConfigProvider) {
    this.busStopId = this.navParams.get('busId');
  }

  saveBusSettings(){
    this.configSrv.getSettings().then(settings =>{
      settings.busStopId = this.busStopId;
      settings.busStopNr = this.selectedNumber;

      this.configSrv.saveSettings(settings).then(()=>{
        this.navCtrl.popToRoot();
      });
    });
  }
}

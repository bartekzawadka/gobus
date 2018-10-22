import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
import {TimetableProvider} from "../../providers/timetable/timetable";
import {ConfigProvider} from "../../providers/config/config";
import {Settings} from "../../models/settings";
import {BusStop} from "../../models/bus-stop";
import {ChooseBusStopNumberPage} from "../choose-bus-stop-number/choose-bus-stop-number";

/**
 * Generated class for the SearchBusStopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-bus-stop',
  templateUrl: 'search-bus-stop.html',
})
export class SearchBusStopPage {
  busStopName: string;
  private settings: Settings = new Settings();
  isSearchEnabled = false;
  busStops: Array<BusStop> = [];
  selectedBusStop: BusStop;
  autocomplete = "on";

  constructor(
    public navCtrl: NavController,
    public configSrv: ConfigProvider,
    public timetableSrv: TimetableProvider,
    public errorDialogSrv: ErrorDialogProvider,
    public loaderCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.configSrv.getSettings().then(settings => {
      this.settings = settings;
      this.isSearchEnabled = true;
    }).catch(e => {
      this.errorDialogSrv.showError(e);
    })
  }

  search() {
    if(!this.busStopName || this.busStopName === ''){
      return;
    }

    let loader = this.loaderCtrl.create();
    loader.present().then(() => {
      this.timetableSrv.getBusStopByName(this.busStopName).then(data => {
        loader.dismiss().then(() => {
          this.busStops = data;
        });
      }).catch(e => {
        loader.dismiss().then(() => {
          this.errorDialogSrv.showError(e);
        });
      })
    }, e => {
      loader.dismiss().then(() => {
        this.errorDialogSrv.showError(e);
      });
    })
  }

  chooseBusNumber(){
    this.navCtrl.push(ChooseBusStopNumberPage, {
      busId: this.selectedBusStop.id
    });
  }
}

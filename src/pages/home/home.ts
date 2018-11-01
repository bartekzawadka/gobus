import {Component} from '@angular/core';
import {NavController, Toast, ToastController} from 'ionic-angular';
import {TimetableProvider} from "../../providers/timetable/timetable";
import {ConfigProvider} from "../../providers/config/config";
import {Settings} from "../../models/settings";
import {BusStop} from "../../models/bus-stop";
import * as _ from 'lodash';
import * as moment from 'moment';
import {BusSchedule} from "../../models/bus-schedule";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private errorToast: Toast;
  private isErrorToastVisible = false;
  busStop = BusStop.fromSettings(new Settings());
  busList : Array<BusSchedule> = [];
  actualTime = moment();

  constructor(
    public navCtrl: NavController,
    public timetableProvider: TimetableProvider,
    public configProvider: ConfigProvider,
    public toastCtrl: ToastController) {

    this.errorToast = this.toastCtrl.create({
      position: 'top',
      dismissOnPageChange: true
    });
  }

  ionViewDidEnter() {
    this.configProvider.getSettings().then(settings => {
      let clean = false;
      if(settings.busStopId !== this.busStop.id
        || settings.busStopNr !== this.busStop.number){
        clean = true;
      }

      this.busStop = BusStop.fromSettings(settings);
      this.loadData(clean);
      this.runTimer();
    });
  }

  private loadData(cleanExistingData = false) {
    if(cleanExistingData) {
      this.busList = [];
    }

    let me = this;

    me.timetableProvider
      .getBusLinesForBusStop(this.busStop)
      .then(result => {
        me.busStop = result;
        me.presentSchedule(me);
      }).catch()
  }

  private presentSchedule(ctrl: any) {
    let handler = setTimeout(
      () => {
        ctrl.onPresentationTick(handler, ctrl);
      },
      ConfigProvider.getSysConfig().dataRefreshInterval);
  }

  private onPresentationTick(handler: number, ctrl: any) {
    clearTimeout(handler);

    let promises: Array<Promise<any>> = [];

    _.forEach(ctrl.busStop.lines, (item) => {
      promises.push(
        ctrl.timetableProvider.getBusSchedule(
          ctrl.busStop.id,
          ctrl.busStop.number,
          item));
    });

    Promise.all(promises)
      .then(results => {
        ctrl.handleError().then(() => {
          ctrl.handleResults(results);
          ctrl.presentSchedule(ctrl);
        });
      })
      .catch(e => {
        ctrl.handleError(e)
          .then(ctrl.presentSchedule)
          .catch(ctrl.presentSchedule);
      });
  }

  private handleResults(data: any[]) {
    let schedule: Array<BusSchedule> = _.flatten(data);

    const dateFormat = "DD-MM-YYYY";
    const dateTimeFormat = dateFormat + " HH:mm:ss";

    let smallerSchedule: Array<BusSchedule> = [];
    let currentTime = moment();
    let currentDateText = currentTime.format(dateFormat);

    _.forEach(schedule, (item) => {
      let time = moment(currentDateText + " " + item.eta, dateTimeFormat);
      if (time > currentTime) {
        item.time = time;
        item.remaining = moment.duration(time.diff(currentTime));
        let minutes = item.remaining.asMinutes();
        if(minutes <= 5){
          item.isCommingSoon = true;
        }
        smallerSchedule.push(item);
      }
    });

    let sortedSchedules = _.orderBy(smallerSchedule, [i => i.time]);

    let numberOfResults = ConfigProvider.getSysConfig().numberOfResults;
    if (!numberOfResults) {
      numberOfResults = 10;
    }

    this.busList = _.take(sortedSchedules, numberOfResults);
  }

  private handleError(e?): Promise<any> {
    return new Promise((resolve, reject) => {
      if (e) {
        this.errorToast.setMessage(e);
        if (!this.isErrorToastVisible) {
          this.errorToast.present()
            .then(() => {
              this.isErrorToastVisible = true;
              resolve();
            })
            .catch(reject);
        } else {
          this.isErrorToastVisible = true;
          resolve();
        }
      } else {
        if (this.isErrorToastVisible) {
          this.errorToast.dismiss()
            .then(() => {
              this.isErrorToastVisible = false;
              resolve();
            })
            .catch(reject);
        } else {
          this.isErrorToastVisible = false;
          resolve();
        }
      }
    });
  }

  private runTimer(){
    let me = this;
    setInterval(()=>{
      me.actualTime = moment();
    }, 1000);
  }
}

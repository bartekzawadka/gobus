import {Settings} from "./settings";

export class BusStop {
  name: string;
  id: number;
  number: string;
  lines: Array<string> = [];

  static fromSettings(settings: Settings){
    let busStop = new BusStop();
    busStop.number = settings.busStopNr;
    busStop.name = settings.busStopName;
    busStop.id = settings.busStopId;

    return busStop;
  }
}

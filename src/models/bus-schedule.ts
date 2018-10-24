import {Duration, Moment} from "moment";

export class BusSchedule {
  direction: string;
  eta: string;
  line: string;
  time: Moment;
  remaining: Duration;
  isCommingSoon = false;
}

import moment from "moment";

export function checkTime() {
    const time = moment().format("HH:mm")
    const momentTime = moment(time, "HH:mm");
    const minutes = momentTime.minutes();
    if (minutes === 1 || minutes === 2 || minutes === 31 || minutes === 32) {
      return true;
    } 
    else {
      return false;
    }
  }
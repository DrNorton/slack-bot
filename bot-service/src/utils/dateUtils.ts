import moment = require('moment');

export default function getISO(date: Date) {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [
    date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
  ].join('-');
}
export function getCurrentWeekNumber() {
  return moment().week();
}

export function getCurrentMonthNumber() {
  return moment().month() + 1;
}

export function getCurrentYearNumber() {
  return moment().year();
}

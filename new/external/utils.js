// Cache. Updated each 24 hours
const periodData = {
  lastChange: 0,
  fullPeriod: 0,
  remainder: 0
}

exports.periodInfo = () => {
  let now = new Date();
  if (now.valueOf() - periodData.lastChange > 1000 * 3600 * 24) {
    let currentPeriod = now / (1000 * 3600 * 24 * 30);
    periodData.fullPeriod = Math.floor(currentPeriod);
    periodData.remainder = currentPeriod - periodData.fullPeriod;
    periodData.lastChange = now.valueOf();
  }
  return {fullPeriod: periodData.fullPeriod, remainder: periodData.remainder};
}
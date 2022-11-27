const SVS_B = eAmt => {
  window.scrollBy(0, eAmt);
};

const scrollTo = (e, time, offset = 0) => {
  const { top } = e.getBoundingClientRect();

  const eAmt = (top - offset) / 50;

  let curTime = 0;

  while (curTime <= time) {
    window.setTimeout(SVS_B, curTime, eAmt, top);
    curTime += time / 50;
  }
};

export default scrollTo;

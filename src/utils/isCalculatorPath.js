const isCalculatorPath = () =>
  window.location.pathname.includes('spousal-support') ||
  window.location.pathname.includes('child-support');

export default isCalculatorPath;

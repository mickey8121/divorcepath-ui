const getDetailsOpenFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('detailsOpen'));
  } catch (err) {
    return {};
  }
};

export default getDetailsOpenFromLocalStorage;

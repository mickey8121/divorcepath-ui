const SHOW_ALERT = 'divorcepath-ui/src/ducks/alert/SHOW_ALERT';
const CLOSE_ALERT = 'divorcepath-ui/src/ducks/alert/CLOSE_ALERT';

const initialState = {
  isOpen: false,
};

const alertReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case SHOW_ALERT:
      return { isOpen: true, ...action.payload };
    case CLOSE_ALERT:
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export const showAlert = alert => ({
  type: SHOW_ALERT,
  payload: alert,
});

export const closeAlert = () => ({
  type: CLOSE_ALERT,
});

export default alertReducer;

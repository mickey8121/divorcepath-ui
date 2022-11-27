const CLEAR_MODAL = 'divorcepath-ui/src/ducks/modal/CLEAR_MODAL';
const CLOSE_MODAL = 'divorcepath-ui/src/ducks/modal/CLOSE_MODAL';
const SHOW_MODAL = 'divorcepath-ui/src/ducks/modal/SHOW_MODAL';
const TOGGLE_MODAL = 'divorcepath-ui/src/ducks/modal/TOGGLE_MODAL';
const TOGGLE_LOADING = 'divorcepath-ui/src/ducks/modal/TOGGLE_LOADING';
const TOGGLE_DISABLED = 'divorcepath-ui/src/ducks/modal/TOGGLE_DISABLED';

const initialState = {};

const modalReducer = (state = { ...initialState }, action) => {
  const { type, name, options, loading, disabled } = action;

  switch (type) {
    case SHOW_MODAL:
      return { ...state, [name]: { isOpen: true, options } };
    case CLEAR_MODAL:
      return { ...state, [name]: { isOpen: !!state[name]?.isOpen } };
    case CLOSE_MODAL:
      return { ...state, [name]: { ...state[name], isOpen: false } };
    case TOGGLE_MODAL:
      return {
        ...state,
        [name]: {
          options,
          ...state[name],
          isOpen: !state[name]?.isOpen,
        },
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        [name]: {
          ...state[name],
          isOpen: !!state[name]?.isOpen,
          loading: typeof loading === 'undefined' ? !state[name]?.loading : loading,
        },
      };
    case TOGGLE_DISABLED:
      return {
        ...state,
        [name]: {
          ...state[name],
          isOpen: !!state[name]?.isOpen,
          disabled: typeof disabled === 'undefined' ? !state[name]?.disabled : disabled,
        },
      };
    default:
      return state;
  }
};

export const openModal = (name, options, disabled) => ({
  type: SHOW_MODAL,
  name,
  options,
  disabled,
});

export const clearModal = name => ({
  type: CLEAR_MODAL,
  name,
});

export const closeModal = name => ({
  type: CLOSE_MODAL,
  name,
});

export const toggleModal = (name, options) => ({
  type: TOGGLE_MODAL,
  name,
  options,
});

export const toggleLoading = (name, loading) => ({
  type: TOGGLE_LOADING,
  name,
  loading,
});

export const toggleDisabled = (name, disabled) => ({
  type: TOGGLE_DISABLED,
  name,
  disabled,
});

export default modalReducer;

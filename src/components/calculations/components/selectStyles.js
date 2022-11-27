const customStyles = {
  container: provided => ({
    ...provided,
    display: 'inline-block',
    width: 180,
  }),
  valueContainer: provided => ({
    ...provided,
    height: 48,
    width: 180,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
};

export default customStyles;

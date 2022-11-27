const checkIsProPlan = me => {
  if (me?.id) {
    if (typeof me?.professional?.id === 'string') {
      return true;
    }

    return false;
  }

  return !!JSON.parse(localStorage.getItem('isProfessional'));
};

export default checkIsProPlan;

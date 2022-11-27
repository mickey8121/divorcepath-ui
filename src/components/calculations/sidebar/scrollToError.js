const scrollToError = () => {
  setTimeout(() => {
    const elements = document.querySelectorAll('.invalid-feedback');

    let currentElement = null;

    elements.forEach(element => {
      if (!currentElement && element.innerHTML) currentElement = element;
    });

    if (!currentElement) return;

    currentElement.previousSibling.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, 10);
};

export default scrollToError;

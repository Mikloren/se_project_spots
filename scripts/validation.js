const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitBtnSelector: ".modal__submit-btn",
  inactiveBtnSelector: "modal__submit-btn_type_disabled",
  errorClass: "modal__input_type_error",
};

const showInputError = (formEl, inputEl, errorMsg, options) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(options.errorClass);
};

const hideInputError = (formEl, inputEl, options) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(options.errorClass);
};

const checkInputValidity = (formEl, inputEl, options) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, options);
  } else {
    hideInputError(formEl, inputEl, options);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

const toggleButtonState = (inputList, buttonEl, options) => {
  if (hasInvalidInput(inputList)) {
    buttonEl.classList.add(options.inactiveBtnSelector);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(options.inactiveBtnSelector);
    buttonEl.disabled = false;
  }
};

const setEventListeners = (formEl, options) => {
  const inputList = Array.from(formEl.querySelectorAll(options.inputSelector));
  const buttonElement = formEl.querySelector(options.submitBtnSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formEl, inputElement, options);
      toggleButtonState(inputList, buttonElement, options);
    });
  });
  toggleButtonState(inputList, buttonElement, options);
};

const enableValidation = (options) => {
  const formList = Array.from(document.querySelectorAll(options.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, options);
  });
};

const resetValidation = (formEl, options) => {
  const inputList = Array.from(formEl.querySelectorAll(options.inputSelector));
  const buttonEl = formEl.querySelector(options.submitBtnSelector);
  inputList.forEach((input) => {
    hideInputError(formEl, input, options);
  });
  toggleButtonState(inputList, buttonEl, options);
};

enableValidation(config);

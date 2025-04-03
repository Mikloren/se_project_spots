export const config = {
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
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl, options) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, options);
  } else {
    enableButton(buttonEl, options);
  }
};

export const disableButton = (buttonEl, options) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(options.inactiveBtnSelector);
};

const enableButton = (buttonEl, options) => {
  buttonEl.disabled = false;
  buttonEl.classList.remove(options.inactiveBtnSelector);
};

export const resetValidation = (formEl, inputList, options) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input, options);
  });
};

const setEventListeners = (formEl, options) => {
  const inputList = Array.from(formEl.querySelectorAll(options.inputSelector));
  const buttonEl = formEl.querySelector(options.submitBtnSelector);
  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, options);
      toggleButtonState(inputList, buttonEl, options);
    });
  });
  toggleButtonState(inputList, buttonEl, options);
};

export const enableValidation = (options) => {
  const formList = Array.from(document.querySelectorAll(options.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, options);
  });
};

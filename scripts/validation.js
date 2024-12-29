const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitBtnSelector: ".modal__submit-btn",
  inactiveBtnSelector: ".modal__submit-btn_type_disabled",
  errorClass: ".modal__input_type_error",
};

const hideInputError = (formEl, inputEl, config = { errorClass: "error" }) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (errorMsgEl) {
    errorMsgEl.textContent = "";
  }
  if (inputEl && inputEl.classList) {
    inputEl.classList.remove(config.errorClass);
  }
};

const showInputError = (
  formEl,
  inputEl,
  errorMsg,
  config = { errorClass: "error" }
) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  if (errorMsgEl) {
    errorMsgEl.textContent = errorMsg;
  }
  if (inputEl && inputEl.classList) {
    inputEl.classList.add(config.errorClass);
  }
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const inactiveBtnSelector = ".modal__submit-btn_type_disabled";

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    enableButton(buttonElement, config);
  }
};

const disableButton = (buttonElement, inactiveButtonClass) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(inactiveButtonClass);
};
const enableButton = (buttonElement, inactiveButtonClass) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(inactiveButtonClass);
};

const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
  });
};

const setEventListener = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitBtnSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config, formSelector) => {
  const formList = document.querySelectorAll(formSelector);
  formList.forEach((formEl) => {
    setEventListener(formEl, config);
  });
};

enableValidation(config);

import "./index.css";
import {
  enableValidation,
  config,
  resetValidation,
  disableButton,
} from "../scripts/validate.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/Text.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "01be27a1-7b80-4fd3-b5bc-875ff189e5bd",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([initialCards, userInfo]) => {
    initialCards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    userAvatar.src = userInfo.avatar;
  })
  .catch((err) => console.error("Failed to load app data:", err));

const closeBtns = document.querySelectorAll(".modal__close-btn");

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const userAvatar = document.querySelector(".profile__avatar");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");

const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = document.querySelector(".avatar__close-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn_cancel"
);
const deleteForm = document.forms["delete-form"];

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.altText;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) =>
    handleLike(evt, data._id, data.isLiked)
  );

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  requestAnimationFrame(() => {
    document.addEventListener("keydown", closeModalEsc);
    modal.addEventListener("mousedown", handleOveraly);
  });
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", closeModalEsc);
    modal.removeEventListener("mousedown", handleOveraly);
  }
}

function handleOveraly(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function closeModalEsc(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

function handleLike(event, id, isLiked) {
  api
    .changeLike(id, isLiked)
    .then(() => {
      event.target.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
      disableButton(cardSubmitBtn, config);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      disableButton(cardSubmitBtn, config);
      evt.target.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  avatarSubmitBtn.disabled = true;
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      userAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      disableButton(avatarSubmitBtn, config);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    config
  );
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

closeBtns.forEach((button) => {
  button.addEventListener("click", (evt) => {
    const modal = evt.target.closest(".modal");
    closeModal(modal);
  });
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

//for (let i = 0; i < initialCards.length; i++) {
//  const cardElement = getCardElement(initialCards[i]);
//  cardsList.prepend(cardElement);
//}

enableValidation(config);

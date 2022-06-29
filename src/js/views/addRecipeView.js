import icons from 'url:../../img/icons.svg';
// Import parent class
import View from './View.js';
// This view displays the pagination buttons

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // To attach the event listeners to the view as soon as the page loads (AddRecipeView is created)
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // Make modal window and overlay visible
  // controller does not interfere at all
  // Manually setting this keyword necessary here
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  // Hide modal and overlay by clicking close button or anywhere on modal
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  // upload form data on button submission
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // Reading form data with modern api -> (expands into array)
      // this points to form as it is in the callback function
      const dataArr = [...new FormData(this)];
      // convert Array data to Object using Object.fromEntries()
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

// Import parent class
import View from './view.ts';
import type { NewRecipeData } from '../types.ts';
// This view displays the pagination buttons

class AddRecipeView extends View<undefined> {
  protected _parentElement = document.querySelector('.upload') as HTMLElement | null;
  protected _message = 'Recipe was successfully uploaded :)';
  private _window = document.querySelector('.add-recipe-window') as HTMLElement;
  private _overlay = document.querySelector('.overlay') as HTMLElement;
  private _btnOpen = document.querySelector('.nav__btn--add-recipe') as HTMLElement;
  private _btnClose = document.querySelector('.btn--close-modal') as HTMLElement;

  // To attach the event listeners to the view as soon as the page loads (AddRecipeView is created)
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow(): void {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // Make modal window and overlay visible
  // controller does not interfere at all
  // Manually setting this keyword necessary here
  private _addHandlerShowWindow(): void {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }

  // Hide modal and overlay by clicking close button or anywhere on modal
  private _addHandlerHideWindow(): void {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  // upload form data on button submission
  addHandlerUpload(handler: (data: NewRecipeData) => void): void {
    this._parentElement!.addEventListener('submit', function (this: HTMLFormElement, e: Event) {
      e.preventDefault();
      // Reading form data with modern api -> (expands into array)
      // this points to form as it is in the callback function
      const dataArr = [...new FormData(this)];
      // convert Array data to Object using Object.fromEntries()
      const data = Object.fromEntries(dataArr) as NewRecipeData;
      handler(data);
    });
  }

  protected _generateMarkup(): string {
    return '';
  }
}

export default new AddRecipeView();

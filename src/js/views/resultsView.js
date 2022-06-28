import icons from 'url:../../img/icons.svg';
// Import parent class
import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    // log the received data if array is not empty
    if (this._data && this._data.length !== 0) console.log(this._data);
    // For each recipe, generate markup preview then join them into one code string
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    // if the url id is same as preview id, highlight recipe preview
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${
          result.id === id ? 'preview__link--active' : ''
        }" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}
          </div>
        </a>
      </li>`;
  }
}

export default new ResultsView();

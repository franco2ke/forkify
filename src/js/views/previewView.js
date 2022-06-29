import icons from 'url:../../img/icons.svg';
// Import parent class
import View from './View.js';
// PrevieView used as a child view of the resultsView and bookmarksView

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    // if the url id is same as preview id, highlight recipe preview
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}
          </div>
        </a>
      </li>`;
  }
}

export default new PreviewView();

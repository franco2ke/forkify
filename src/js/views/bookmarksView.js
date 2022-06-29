// Import parent class
import View from './View.js';
// Import sibling class that will generate individual previews
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // For parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;-)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // log the received data if array is not empty
    // if (this._data && this._data.length !== 0) console.log(this._data);
    // For each recipe, generate markup preview then join them into one code string
    // previewView.render() generates a single preview at a time
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();

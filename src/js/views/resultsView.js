// Import parent class
import View from './View.js';
// Import sibling class that will generate individual previews
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // For parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    // log the received data if array is not empty
    // if (this._data && this._data.length !== 0) console.log(this._data);
    // For each recipe, generate markup preview then join them into one code string
    return this._data
      .map(searchResult => previewView.render(searchResult, false))
      .join('');
  }
}

export default new ResultsView();

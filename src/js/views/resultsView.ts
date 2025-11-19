// Import parent class
import View from './view.ts';
// Import sibling class that will generate individual previews
import previewView from './previewView.ts';
import type { RecipePreview } from '../types.ts';

class ResultsView extends View<RecipePreview[]> {
  protected _parentElement = document.querySelector('.results') as HTMLElement | null;
  protected _errorMessage = 'No recipes found for your query! Please try again';
  protected _message = '';

  protected _generateMarkup(): string {
    // log the received data if array is not empty
    // if (this._data && this._data.length !== 0) console.log(this._data);
    // For each recipe, generate markup preview then join them into one code string
    return this._data
      .map(searchResult => previewView.render(searchResult, false) as string)
      .join('');
  }
}

export default new ResultsView();

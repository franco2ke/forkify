// Import parent class
import View from './view.ts';
// Import sibling class that will generate individual previews
import previewView from './previewView.ts';
import type { Recipe } from '../types.ts';

class BookmarksView extends View<Recipe[]> {
  protected _parentElement = document.querySelector('.bookmarks__list') as HTMLElement | null;
  protected _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;-)';
  protected _message = '';

  addHandlerRender(handler: () => void): void {
    window.addEventListener('load', handler);
  }

  protected _generateMarkup(): string {
    // log the received data if array is not empty
    // if (this._data && this._data.length !== 0) console.log(this._data);
    // For each recipe, generate markup preview then join them into one code string
    // previewView.render() generates a single preview at a time
    return this._data
      .map(bookmark => previewView.render(bookmark, false) as string)
      .join('');
  }
}

export default new BookmarksView();

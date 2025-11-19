import icons from 'url:../../img/icons.svg';
// Import parent class
import View from './view.ts';
import type { SearchState } from '../types.ts';
// This view displays the pagination buttons

class PaginationView extends View<SearchState> {
  protected _parentElement = document.querySelector('.pagination') as HTMLElement | null;

  // change search page to next or previous
  addHandlerChangePage(handler: (page: number) => void): void {
    // event delegation to listen for two events simultaneously
    this._parentElement!.addEventListener('click', function (e) {
      // searches for clicked elements closest to parents with given 'selector' toward document root
      const btn = (e.target as Element).closest('.btn--inline') as HTMLElement | null;
      console.log(btn);
      // Guard Clause
      if (!btn) return;

      // Obtain page to go to from button itself
      const goToPage = +(btn.dataset.goto ?? 1); // convert string to number
      // Call handler (controller.controlPagination()) with the page you want to go to
      handler(goToPage);
    });
  }

  protected _generateMarkup(): string {
    const curPage = this._data.page;
    // Determine the number of pages, round up
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>`;
    }
    // Middle / Other page
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>

        `;
    }
    // Page 1, and there are NO other pages - Default Scenario
    return '';
  }
}

export default new PaginationView();

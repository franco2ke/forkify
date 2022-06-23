import icons from 'url:../../img/icons.svg';
// Import parent class
import View from './View.js';
// This view displays the pagination buttons

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // event delegation to listen for two events simultaneously
    this._parentElement.addEventListener('click', function (e) {
      // searches for clicked elements closest to parents with given 'selector' toward document root
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      // Guard Clause
      if (!btn) return;

      // Obtain page to go to from button itself
      const goToPage = +btn.dataset.goto; // convert string to number

      handler(goToPage);
    });
  }

  _generateMarkup() {
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

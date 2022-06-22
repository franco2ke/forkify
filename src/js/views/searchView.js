class SearchView {
  _parentEl = document.querySelector('.search');

  //
  getQuery() {
    // get value of form input which is a child element
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // After searching, we should clear the view
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // The publisher function
  addHandlerSearch(handler) {
    // By listening for the submit event on the parent element which is the entire form, the submit event will trigger whether the button is clicked or the use hits the enter key on the keyboard
    this._parentEl.addEventListener('submit', function (e) {
      // When a form is submitted the page will automatically load unless prevented
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();

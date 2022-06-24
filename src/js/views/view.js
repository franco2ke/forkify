import icons from 'url:../../img/icons.svg';
// Parent class of other views
export default class View {
  _data;
  render(data) {
    // Guard clause in case of no data or if data is an empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const markup = this._generateMarkup();
    // Remove place holder html in container
    this._clear();
    // Display updated Recipe
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Updating using a DOM updating algorithm
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    // compare old and new markup and only change text, attributes that have changed between versions
    // Not easy to compare markup that just consists of strings
    // Therefore convert newMarkup string to DOM object in memory that we can then use to compare with existing document
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // Select all elements in the virtual DOM
    // Array.from() converts returned nodelist into actually array to allow us to use array methods, map, forEach etc
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // Select all elements in the real DOM that exists on the browser page
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    // Comparing the DOMs by looping over the two arrays at the same time
    // array.forEach(function(currentValue, index, arr), thisValue)
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Compare nodes by using element.isEqualNode() method
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update changed textcontent where current element is different from new / virtual element
      if (
        // Text content always the firstChild
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('🤪', newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes when new element is different from current one
      // Element.setAttribute(name, value) sets the value of an attribute on the specified element. If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value.
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
        // console.log(curEl.attributes);
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Render the Spinner function, while recipe is loading
  renderSpinner = function () {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  // Display the error message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Display the success message
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

// In Parcel 2 we can import all kinds of assets including images
// Use "url: <path>" for static assets that are not programming files; images, videos, sound files etc.
import icons from 'url:../img/icons.svg';
// Polyfilling
import 'core-js/stable'; // Polyfills async await
import 'regenerator-runtime/runtime'; // Polyfills everything else

// console.log(icons);
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// LEC 288: Loading a Recipe from API

// Render the Spinner function, while recipe is loading
const renderSpinner = function (parentEl) {
  const markup = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;

  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

// load recipe from api and process the response
const showRecipe = async function () {
  try {
    // Obtaining the hash from the window object once hashchange event has been triggered
    // The Window.location read-only property returns a Location object with information about the current location of the document.
    // The Location interface represents the location (URL) of the object it is linked to. Changes done on it are reflected on the object it relates to. Both the Document and Window interface have such a linked Location, accessible via Document.location and Window.location respectively.
    // location.hash - A string containing a '#' followed by the fragment identifier of the URL.
    const id = window.location.hash.slice(1); // slice from position 1 to the end, i.e. remove first character
    // console.log(id);
    // Guard clause for case where URL has no id
    if (!id) return;

    // 1) loading Recipe

    // Render spinner when waiting for image to load
    renderSpinner(recipeContainer);

    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );

    // Throw custom error
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    const data = await res.json();

    console.log(res, data);

    // Object destructuring
    let { recipe } = data.data;

    // overwriting the old object to remove underscores
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);

    // 2) LEC 289: Rendering the Recipe

    const markup = ` 
      <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            recipe.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            recipe.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${recipe.ingredients
            .map(ing => {
              return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>`;
            })
            // Join() creates and returns a new string by concatenating all the elements in an array, separated by commas or a specified separator string.
            .join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            recipe.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${recipe.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;

    // Remove place holder html in container
    recipeContainer.innerHTML = '';
    // Display updated Recipe
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    alert(err);
  }
};

// LEC 290: Listening for load and hashchange events

// NOTE : Listen for the hashchange event
// the changing of the hash which is a url value, is an event that we can listen for
// The recipe is loaded everytime a recipe is clicked on.
// window.addEventListener('hashchange', showRecipe);

// NOTE: Listen for the page load event
// Handle's situation where the url is copied to a new browser page in which case there is no change and hence the hashchange event is not triggered.
// window.addEventListener('load', showRecipe);

// Using an array to attach multiple events (hashchange, load) to one callback function (showRecipe)
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, showRecipe)
);

////////////////////////////////////////
// LEC 291: The MVC Architecture
// Why do we need to have an architecture for our app?

// Like a house, software needs a STRUCTURE: the way we organize our code
// STRUCTURE: How we organize and divide the code into different modules, classes and functions
// MAINTAINABILITY: A project is never done! We will need to be able to easily change it in the future
// EXPANDABILITY: We also need ot be able to easily add new features
// The perfect architecture meets the above 3 needs.

// We can create our own architecture.
// OR we can use well-established architecture patterns like MVC, MVP, Flux, etc.
// Frameworks like React, Vue, Angular, etc., help modern developers take care of the Architecture for them, especially for large scale applications

// NOTE Components of any Architecture
// 1. Business Logic
// 2. State
// 3. HTTP Library
// 4. Application Logic (Router)
// 5. Presentation Logic (UI Layer)

// 1. Business Logic
// - Code that solves the actual business problem.
// - Directly related to what business does and what it needs.
// - Example: sending messages, storing transactions, calculating taxes

// 2. State
// - Essentially stores all the data about the application
// - Should be the single source of truth
// - UI should be kept in sync with the state
// - State libraries exist ? e.g. Redux

// 3. HTTP Library
// - Responsible for making and receiving AJAX requests (fetch())
// - Optional but almost always necessary in real world apps

// 4. Application Logic (Router)
// - Code that is only concerned about the implementation of the application itself.
// - Handles navigation and UI events. Not related to underlying business problem
// - Router - mapping actions to the user's navigation

// 5. Presentation Logic (UI Layer)
// - Code that is concerned about the visible part of the application.
// - Essentially displays application state to keep everything in sync.

// NOTE The Model - View - Controller (MVC) Architecture
// MODEL -> About the applications data, contains business logic, state and HTTP Library. Interacts with web
// CONTROLLER -> Contains the application logic and acts as the bridge between model and view (which shouldn't know about one another)
// Controller Handles UI events and dispatches tasks to model and view - orchestrates the application.
// VIEW -> It's the presentation logic and what interacts with the User

// One of the main aims of the MVC architecture is to separate busines logic from presentation logic
// Two types of communication flows in app
// 1. Function calls and module imports
// 2. Data flows between the various components

// Only the controller, imports and calls functions from the model and view, never the other way round.
// Model and View, completely isolated - Don't import anything.

// NOTE: Controller and Model created as Modules, while View created as Class

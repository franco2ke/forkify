import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// Polyfilling
import 'core-js/stable'; // Polyfills async await
import 'regenerator-runtime/runtime'; // Polyfills everything else

// NOTE Parcel code to enabel hot module reloading
// Patch the code that was changed and keep the state in your app
// Retain application state which is lost during a full reload
// if (module.hot) {
//   module.hot.accept();
// }

// LEC 288: Load a Recipe from API

// load recipe from api and process the response
const controlRecipes = async function () {
  try {
    // Obtain the hash from the window object once hashchange/load event has been triggered
    // The Window.location read-only property returns a Location object with information about the current location of the document.
    // The Location interface represents the location (URL) of the object it is linked to. Changes done on it are reflected on the object it relates to. Both the Document and Window interface have such a linked Location, accessible via Document.location and Window.location respectively.
    // location.hash - A string containing a '#' followed by the fragment identifier of the URL.
    const id = window.location.hash.slice(1); // slice from position 1 to the end, i.e. remove first character
    // Guard clause for case where URL has no id
    if (!id) return;

    // 1) Render spinner when waiting for recipe to load
    recipeView.renderSpinner();

    // 2) Update results view to highlight selected search result when loading recipe
    resultsView.update(model.getSearchResultsPage());
    // console.log(model.state.bookmarks);

    // 3) Update bookmarks menu to highlight selected recipe
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    // 4) load Recipe (async function which returns promise).
    // An async calling another async where we want to stop execution until a result is returned.
    // fetch recipe data and store in : model.state.recipe;
    await model.loadRecipe(id);

    // 5) LEC 289: Rendering the Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// Handles Search Queries and Results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    // Guard clause for when no query has been entered
    if (!query) return;
    // 2) Load search results and update to state
    await model.loadSearchResults(query);
    // 3) Render results
    // resultsView.render(model.state.search.results);
    // Render results with Pagination (e.g. 10 per page)
    resultsView.render(model.getSearchResultsPage());
    // 4) Display / Render the pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Handler for Page changes (when prev or next buttons are pressed)
const controlPagination = function (goToPage) {
  // 1) Render new page results and update search page number in state
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Display / Render new pagination buttons
  // - Obtains current search page number from state
  paginationView.render(model.state.search);
};

// Update Recipe Servings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  // Update the recipe view using a DOM Updating Algorithm
  recipeView.update(model.state.recipe);
};

// Handle bookmark functionality (add, delete, update views)
const controlAddBookmark = function () {
  // 1) Add / remove bookmark in state object
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update recipe view button
  recipeView.update(model.state.recipe);
  // 3) Add recipe preview to bookmarks drop down menu
  bookmarksView.render(model.state.bookmarks);
};

// To render bookmarks on initial page load
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Upload new recipe from form plus included functionality
const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe);
  // Upload new recipe data
};

// Initializes the application
// Publisher Subscriber Pattern Implementation
const init = function () {
  // Register Handler Functions
  // Render bookmarks on initial page load to allow updates
  bookmarksView.addHandlerRender(controlBookmarks);
  // Load recipe on appropriate events (load or hashchange)
  recipeView.addHandlerRender(controlRecipes);
  // Update recipe quantities on change of serving size
  recipeView.addHandlerUpdateServings(controlServings);
  // Add Bookmark on bookmark button click
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // Handler for Search Results
  searchView.addHandlerSearch(controlSearchResults);
  // Scroll search results page by page
  paginationView.addHandlerChangePage(controlPagination);
  // Upload new recipe's, bookmark and display
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
// LEC 290: Listening for load and hashchange events

// NOTE : Listen for the hashchange event
// the changing of the hash which is a url value, is an event that we can listen for
// The recipe is loaded everytime a recipe is clicked on.
// window.addEventListener('hashchange', controlRecipes);

// NOTE: Listen for the page load event
// Handle's situation where the url is copied to a new browser page in which case there is no change and hence the hashchange event is not triggered.
// window.addEventListener('load', controlRecipes);

// Using an array to attach multiple events (hashchange, load) to one callback function (controlRecipes)

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

////////////////////////////////////////
// LEC 292: Refactoring for MVC
// 1 file for each different view.
// Views are simply much bigger
// async await returns fulfilled promises even when errors occur

////////////////////////////////////////
// LEC 294: Event Handlers in MVC: Publisher-Subscriber Pattern
// How we can listen for events and handle them within the MVC architecture efficiently
// Events should be handled in the controller (otherwise we would have application logic in the view)
// Events should be listened for in the view (otherwise we would need DOM elements, Presentation Logic, in the controller)
// NOTE: however the simple solution to this problem; calling the controller function from the view does not work because, the view is not supposed to even know that a controller exists.

// The right solution is to use a design pattern known as the Publisher-Subscriber Pattern
// A design pattern is just a standard solution to a particular type of problem
// Publisher - Code that knows when to react, e.g. when user clicks search result
// Subscriber - Code that wants to react, that executes when an event occurs
// The Publisher is not aware that a Subscriber exists, as subscriber is in the controller
// NOTE: We can subscribe to the publisher by passing in the subscriber function to the Publisher as an argument.
// 0. Program Starts
// 1. init() function executes
// 2. init() calls the publisher function and passes the subscriber function as an argument
// Basically we subscribe the controller based function to the publisher
// The publisher listens for events and uses the subscriber as callback
// E.G. As soon as the listener publishes an event, the handler that has subscribed will get called

////////////////////////////////////////
// LEC 295: Implementing Error and Success Messages

////////////////////////////////////////
// LEC 302: Developing a DOM updating Algorithm
// - To update the DOM only in areas where something has changed
// - Reduce strain on the browser
// - An update method to use in updating the servings

// Some DOM properties don’t possess corresponding attributes.
// Some HTML attributes don’t possess corresponding properties.
// Some HTML attributes, like ‘class’, possess 1:1 mapping to properties.

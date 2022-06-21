import * as model from './model.js';
import recipeView from './views/recipeView.js';

// Polyfilling
import 'core-js/stable'; // Polyfills async await
import 'regenerator-runtime/runtime'; // Polyfills everything else

// console.log(icons);
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// LEC 288: Loading a Recipe from API

// load recipe from api and process the response
const controlRecipes = async function () {
  try {
    // Obtain the hash from the window object once hashchange event has been triggered
    // The Window.location read-only property returns a Location object with information about the current location of the document.
    // The Location interface represents the location (URL) of the object it is linked to. Changes done on it are reflected on the object it relates to. Both the Document and Window interface have such a linked Location, accessible via Document.location and Window.location respectively.
    // location.hash - A string containing a '#' followed by the fragment identifier of the URL.
    const id = window.location.hash.slice(1); // slice from position 1 to the end, i.e. remove first character
    console.log(id);
    // Guard clause for case where URL has no id
    if (!id) return;
    // Render spinner when waiting for image to load
    recipeView.renderSpinner();

    // 1) load Recipe (async function which returns promise).
    // An async calling another async where we want to stop execution until a result is returned.
    // Result will be change of state : state.recipe;
    await model.loadRecipe(id);

    // 2) LEC 289: Rendering the Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(`${err} wow wow`);
  }
};

// LEC 290: Listening for load and hashchange events

// NOTE : Listen for the hashchange event
// the changing of the hash which is a url value, is an event that we can listen for
// The recipe is loaded everytime a recipe is clicked on.
// window.addEventListener('hashchange', controlRecipes);

// NOTE: Listen for the page load event
// Handle's situation where the url is copied to a new browser page in which case there is no change and hence the hashchange event is not triggered.
// window.addEventListener('load', controlRecipes);

// Using an array to attach multiple events (hashchange, load) to one callback function (controlRecipes)
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipes)
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

////////////////////////////////////////
// LEC 292: Refactoring for MVC
// 1 file for each different view.
// Views are simply much bigger
// async await returns fulfilled promises even when errors occur

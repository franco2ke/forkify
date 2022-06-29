// named imports
// import { bind } from 'core-js/core/function';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

// The state object
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

// load Recipe will edit the state object, afterwhich the controller will obtain the data from there.
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    // console.log(data);

    // Object destructuring
    const { recipe } = data.data;

    // overwriting the old object to remove underscore and erase old data
    // replacing with a new object
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // check if recipe is stored as bookmark and update 'bookmarked' property if true
    // some() loops over an array and returns true if any meets the condition provided
    if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.error(`${err} 💥 💥 💥 💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    // create a new array of recipe results from mapping each recipe object
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    // Reset search results page on every search
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥 💥 💥 💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0 for page 1;
  const end = page * state.search.resultsPerPage; // 9 , slice does not include the last position

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // Reach into recipe state and change quantities for each ingredient
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = (oldQt/oldServings) * newServings
  });

  // Update the Number of persons served in the state, to avoid error when changing servings severally
  state.recipe.servings = newServings;
};

// Store bookmarks in local storage
const persistBookmarks = function () {
  // in chrome dev tools --> Application tab --> Storage --> local storage
  // stringify converts object to JSON string
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Bookmarking recipe by adding it to the bookmark array in the state object
  state.bookmarks.push(recipe);

  // Mark currently loaded recipe as a bookmarked recipe in order to render bookmark button correctly
  // update recipe object
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // update bookmarks in local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Find index of recipe in bookmarks array using id
  const index = state.bookmarks.findIndex(el => el.id === id);
  // Delete bookmark from array
  state.bookmarks.splice(index, 1);
  // Mark currently recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // update bookmarks in local storage
  persistBookmarks();
};

// Model Initialization
// --> Load bookmarks from memory
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // JSON.parse() converts JSON string to object
  if (storage) state.bookmarks = JSON.parse(storage);
};

// init runs as soon a module is imported I believe
init();
console.log(state.bookmarks);

// Debugging function to clear bookmarks
// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };

// clearBookmarks();

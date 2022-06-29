// named imports
// import { bind } from 'core-js/core/function';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSONAJAX } from './helpers.js';
import { AJAX } from './helpers.js';

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

const createRecipeObject = function (data) {
  // Object destructuring
  const { recipe } = data.data;

  // overwriting the old object to remove underscore and erase old data
  // replacing with a new object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // && short circuits, if recipe.key does not exist, it exits and doesnt execute 2nd part
    // if true, expression returns the second value, which when destructured becomes part of the bigger object
    ...(recipe.key && { key: recipe.key }),
  };
};

// load Recipe will edit the state object, afterwhich the controller will obtain the data from there.
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // console.log(data);

    state.recipe = createRecipeObject(data);
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
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    // create a new array of recipe results from mapping each recipe object
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        // && short circuits, if recipe.key does not exist, it exits and doesnt execute 2nd part
        // if true, expression returns the second value, which when destructured becomes part of the bigger object
        ...(rec.key && { key: rec.key }),
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
// console.log(state.bookmarks);

// Debugging function to clear bookmarks
// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };

// clearBookmarks();

// uploading data to api
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    // Object.entries() Converts object to array
    // filter returns an array of elements, to whom the condition runs true

    const ingredients = Object.entries(newRecipe)
      // filter our entrys whose 1st item starts with 'ingredient' and whose 2nd array not empty
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // trim() removes whitespace from both ends of a string and returns a new string, without modifying original string.
        const ingArr = ing[1].split(',').map(el => el.trim());
        // Test if array has 3 items else throw validation error()
        if (ingArr.length != 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Upload data using helper URL
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // create recipe object from returned data
    state.recipe = createRecipeObject(data);
    // add bookmark to local storage
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// named imports
import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

// The state object
export const state = {
  recipe: {},
};

// load Recipe will edit the state object, afterwhich the controller will obtain the data from there.
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    console.log(data);

    // Object destructuring
    const { recipe } = data.data;

    // overwriting the old object to remove underscores
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
    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥 💥 💥 💥`);
  }
};

// Type definitions for Forkify application

export interface Ingredient {
  quantity: number | null;
  unit: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  image: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
  bookmarked?: boolean;
  key?: string;
}

export interface RecipePreview {
  id: string;
  title: string;
  publisher: string;
  image: string;
  key?: string;
}

export interface SearchState {
  query: string;
  results: RecipePreview[];
  resultsPerPage: number;
  page: number;
}

export interface State {
  recipe: Recipe | Record<string, never>;
  search: SearchState;
  bookmarks: Recipe[];
}

export interface ApiRecipeData {
  data: {
    recipe: {
      id: string;
      title: string;
      publisher: string;
      source_url: string;
      image_url: string;
      servings: number;
      cooking_time: number;
      ingredients: Ingredient[];
      key?: string;
    };
  };
}

export interface ApiSearchData {
  data: {
    recipes: {
      id: string;
      title: string;
      publisher: string;
      image_url: string;
      key?: string;
    }[];
  };
}

export interface NewRecipeData {
  title: string;
  sourceUrl: string;
  image: string;
  publisher: string;
  cookingTime: string;
  servings: string;
  [key: string]: string;
}

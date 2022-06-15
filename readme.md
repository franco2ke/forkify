a. User Stories

- Description of the application's functionality from a user's perspective.

1.  As a user, I want to search for recipes, so that I can find new ideas for meals
2.  As a user, I want to be able to update the number of servings, so that I can cook a meal for different numbers of people
3.  As a user, I want to bookmark recipes, so that I can review them later
4.  As a user, I want to be able to create my own recipes, so that I have them all organized in the same app
5.  As a user, I want to be able to see my bookmarks and own recipes when I leave the app and come back later, so that I can close the app safely after cooking

b. Features

- Features are the actual application functionalities that action the User stories

1. Search for recipes ->

- Search functionality: input field to send request to API with searched keywords.
- Display results with pagination.
- Display selected recipe with cooking time, servings and ingredients

2. Update the number of servings ->

- Change servings functionality: update all ingredients according to current number of servings

3. Bookmark recipes ->

- Bookmarking functionality: display list of all bookmarked recipes

4. Create my own recipes ->

- User can upload own recipes
- User recipes will automatically be bookmarked
- User can only see their own recipes, not recipes from other users.

5. See my bookmarks and own recipes when I leave the app and come back later ->

- Store bookmark data in the browser using local storage
- On page load, read saved bookmarks from local storage and display

c. Features -> Nice Structured Flowchart

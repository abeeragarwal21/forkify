// Import all constants
import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config.js";

// Import the getJSON and sendJSON helper function
import { AJAX } from "./helpers.js";

// Export the state of the app, which is an object containing all info needed while app is running
export const state = {
	recipe: {}, // To be filled by thr loadRecipe function
	search: {
		query: "",
		results: [],
		page: 1,
		resultsPerPage: RESULTS_PER_PAGE,
	},
	bookmarks: [],
};

const createRecipeObject = function (data) {
	const { recipe } = data.data;

	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }),
	};
};

export const loadRecipe = async function (id) {
	try {
		// Get json data of the recipe with id passed in from the api url
		const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
		state.recipe = createRecipeObject(data);

		// .some() returns true or false for each item of an array based on the condition in the callback
		// So, for each recipe in the bookmarks array in the state, check if the loaded recipe id is the same as the bookmarks recipe id
		// If it is, set the loaded recipe's bookmarked property to true, else set it to false
		if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
			state.recipe.bookmarked = true;
		} else {
			state.recipe.bookmarked = false;
		}
	} catch (err) {
		// rethrow error to be handled elsewhere
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		// Set the query inside the state to the query passed in
		state.search.query = query;

		// Get JSON data of search from url as an array
		const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

		// For each search result in data.data.recipies, create an object with id, title, publisher and image
		// and store this array in the state under search.results
		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
			};
		});

		// Set the page of the search to 1
		state.search.page = 1;
	} catch (err) {
		// If there is an error rethrow it to handle elsewhere
		throw err;
	}
};

// get a page of sarch results
export const getSearchResultsPage = function (page = state.search.page) {
	// Set search.page inside the state to the page passed in, defaulting to previously set value
	state.search.page = page;

	// Get start number of results by doing (page - 1) * resultsPerPage (eg: page 2 = 2-1*10 = start at 10)
	const start = (page - 1) * state.search.resultsPerPage;

	// Get end number of results by doing page * resultsPerPage (eg: page 2 = 2*10 = finish at 20)
	const end = page * state.search.resultsPerPage;

	// Slice the search results from the start and end that we just calculated and return an array containing results
	// In the page we requested
	return state.search.results.slice(start, end);
};

// Update servings
export const updateServings = function (newServings) {
	// For each ingredient object in state.recipe.ingredients
	state.recipe.ingredients.forEach((ing) => {
		// Calculate new quantity (stored in ingredient.quantity) using formula below:
		// newQuantity = oldQuantity * newServings / oldServings
		ing.quantity = ing.quantity * (newServings / state.recipe.servings);
	});

	// Set the recipe.servings inside the state to the newServings that we recieved
	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	// Push the recipe to the bookmarks array in the state
	state.bookmarks.push(recipe);

	// Mark recipe as bookmarked
	if (recipe.id === state.recipe.id) {
		// Add a new bookmarked property and set to true on currently loaded recipe
		state.recipe.bookmarked = true;
	}

	persistBookmarks();
};

export const deleteBookmark = function (id) {
	// Get the index of the element which has the same id as the one passed in
	const index = state.bookmarks.findIndex((el) => el.id === id);

	// Delete that index from the bookmarks array
	state.bookmarks.splice(index, 1);

	// Set the bookmarked property of the recipe to false
	if (id === state.recipe.id) {
		state.recipe.bookmarked = false;
	}

	persistBookmarks();
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) {
		state.bookmarks = JSON.parse(storage);
	}
};

init();

export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(
				(entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
			)
			.map((ing) => {
				const ingArr = ing[1].split(",").map((el) => el.trim());

				if (ingArr.length !== 3) {
					throw new Error(
						"Wrong ingredient format! Please use the correct format"
					);
				}

				const [quantity, unit, description] = ingArr;

				return {
					quantity: quantity ? Number(quantity) : null,
					unit,
					description,
				};
			});

		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: Number(newRecipe.cookingTime),
			servings: Number(newRecipe.servings),
			ingredients,
		};

		console.log(recipe);
		const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
};

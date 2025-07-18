// IMPORTS ---------------------------------------------------------------------------------
// Transpilers and polyfillers
import "core-js/stable";
import "regenerator-runtime/runtime";

import { MODAL_CLOSE_SECONDS } from "./config.js";

// Model
import * as model from "./model.js";

// Views
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// FOR PARCEL
// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipies = async function () {
	try {
		// Get recipe id from the url by getting the hash and then removing the "#" leaving just the id
		const id = window.location.hash.slice(1);

		// If there's no id, return
		if (!id) {
			return;
		}

		// Spinner animation while waiting for the recipe to be loaded
		recipeView.renderSpinner();

		// Update the resultsView to highlight the right recipe
		resultsView.update(model.getSearchResultsPage());

		// Update the bookmarksView to highlight the right recipe
		bookmarksView.update(model.state.bookmarks);

		// Load recipe (returns a Promise so we have to await)
		await model.loadRecipe(id);

		// Render recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		// Render spinner in resultsView
		resultsView.renderSpinner();

		// Get query from input field
		const query = searchView.getQuery();

		// If there's no query then return
		if (!query) {
			return;
		}

		// Load search results from query
		await model.loadSearchResults(query);

		// Show results and pagination
		resultsView.render(model.getSearchResultsPage(1));
		paginationView.render(model.state.search);
	} catch (err) {
		resultsView.renderError(`${err.message}`);
	}
};

const controlPagination = function (goToPage) {
	// render new results for the page passed in
	resultsView.render(model.getSearchResultsPage(goToPage));

	// render buttons for the page
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update recipe servings in state
	model.updateServings(newServings);

	// Update the recipe again
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// If the recipe is not bookmarked, add bookmark it
	if (!model.state.recipe.bookmarked) {
		// Call the addBookmark function on the current loaded recipe
		model.addBookmark(model.state.recipe);
	} else {
		// If the recipe is bookmarked, remove the bookmark
		model.deleteBookmark(model.state.recipe.id);
	}

	// Update the recipeView to update the page so the icon changes
	recipeView.update(model.state.recipe);

	// Render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();

		await model.uploadRecipe(newRecipe);

		recipeView.render(model.state.recipe);

		addRecipeView.renderMessage();

		bookmarksView.render(model.state.bookmarks);

		// Change URL hash
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		setTimeout(function () {
			addRecipeView.toggleWindow();
			location.reload();
		}, MODAL_CLOSE_SECONDS * 1000);
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	// Add all handlers inside the view with the function to call
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipies);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

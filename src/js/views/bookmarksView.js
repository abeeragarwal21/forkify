import View from "./View.js";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";

class BookmarksView extends View {
	_parentElement = document.querySelector(".bookmarks__list");
	_errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it!";
	_message = "";

	addHandlerRender(handler) {
		window.addEventListener("load", handler());
	}

	_generateMarkup() {
		// this._data represents the array of all bookmarked recipies
		return (
			this._data
				// For each bookmark get the markup of the bookmark from render()
				// As previewView is calling render(), it uses the _generateMarkup() of previewView
				// This returns the string of HTML that we coded.

				// As the original call was for BookmarksView, the _data is set to the bookmarks array as that was what was passed in
				// This _data is stored in the parent View class
				// Due to this, previewView has access to this and so the HTML can be created successfully

				// As we are doing this for each bookmark, using map gives an array of all the markups
				.map((bookmark) => previewView.render(bookmark, false))
				// Join all of the markups together for one big string with all markup to render
				.join("")
		);
	}
}

// Export a new BookmarksView object
export default new BookmarksView();

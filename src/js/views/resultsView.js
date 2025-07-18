import View from "./View.js";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView.js";

class ResultsView extends View {
	_parentElement = document.querySelector(".results");
	_errorMessage = "No recipes found for your search!";
	_message = "";

	_generateMarkup() {
		// this._data represents the array of all search results
		return (
			this._data
				// For each result get the markup of the result from render()
				// As previewView is calling render(), it uses the _generateMarkup() of previewView
				// This returns the string of HTML that we coded.

				// As the original call was for ResultsView, the _data is set to the array of results for the current page as that was what was passed in
				// This _data is stored in the parent View class
				// Due to this, previewView has access to this and so the HTML can be created successfully

				// As we are doing this for each bookmark, using map gives an array of all the markups
				.map((result) => previewView.render(result, false))
				// Join all of the markups together for one big string with all markup to render
				.join("")
		);
	}
}

// Export a new ResultsView object
export default new ResultsView();

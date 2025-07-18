class SearchView {
	_parentElement = document.querySelector(".search");

	// Clear search input function
	_clearInput() {
		this._parentElement.querySelector(".search__field").value = "";
	}

	getQuery() {
		// Store the user' search query by taking the value of the what the user typed inside the search field
		const query = this._parentElement.querySelector(".search__field").value;
		// Clear the input field
		this._clearInput();
		// Return the query user typed in
		return query;
	}

	addHandlerSearch(handler) {
		// Listen for submit on the form element (the parent)
		this._parentElement.addEventListener("submit", function (e) {
			// Prevent default behaviour
			e.preventDefault();
			// Run handler passed in from controller: controlSearchResults()
			handler();
		});
	}
}

// Export a new SearchView
export default new SearchView();

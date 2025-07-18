import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", function (e) {
			// Set the button to the closest parent button with the class .btn--inline as this is the page navigation button
			const btn = e.target.closest(".btn--inline");

			// Guard clause if there is no button (eg clicked outside of button but in parentElements)
			if (!btn) {
				return;
			}

			// Get the page to go to from the dataset of the button
			const goToPage = Number(btn.dataset.goto);

			// Run the handler function in the controller passed in - controlPagination()
			handler(goToPage);
		});
	}

	_generateMarkup() {
		// Get currentPage from the recipe.page (_data is the recipe object inside the state)
		const currentPage = this._data.page;

		// Get the number of pages by dividing the length of the results array containing all searches by the resultsPerPage we want (stored in _data)
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);

		// If page 1 and there are no other pages
		if (currentPage === 1 && numPages > 1) {
			// return the next button markup generated using the generateMarkupBtn function
			return `
            ${this._generateMarkupBtn("next", currentPage)}
            `;
		}

		// If on last page
		if (currentPage === numPages && numPages > 1) {
			// return the previous button markup generated using the generateMarkupBtn function
			return `
            ${this._generateMarkupBtn("prev", currentPage)}
            `;
		}
		// All other pages
		if (currentPage < numPages) {
			// return a template literal of markup of both buttons generated using the generateMarkupBtn function
			return `
            ${this._generateMarkupBtn("prev", currentPage)}
            ${this._generateMarkupBtn("next", currentPage)}
            `;
		}

		// Page 1, no other pages
		return ""; // Dont render any buttons
	}

	// Function to generate the pagination buttons
	_generateMarkupBtn(type, currentPage) {
		// Set gotopage depending on the type of button. If previous, gotopage is the current page - 1 else it is current page + 1
		const goToPage = type === "prev" ? currentPage - 1 : currentPage + 1;

		// Return the markup of the button with the page number it goes to in the dataset and also in the span of the button
		return `
        <button data-goto="${goToPage}" class="btn--inline pagination__btn--${type}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
			type === "prev" ? "left" : "right"
		}"></use>
            </svg>
            <span>Page ${goToPage}</span>
        </button>
        `;
	}
}

export default new PaginationView();

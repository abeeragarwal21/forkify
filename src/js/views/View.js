// Import icons svg for Parcel
import icons from "url:../../img/icons.svg";

export default class View {
	_data;

	// Clear parent element's html by setting it to an empty string
	_clear() {
		this._parentElement.innerHTML = "";
	}

	// Render a recipe
	render(data, render = "true") {
		if (!data || (Array.isArray(data) && data.length === 0)) {
			return this.renderError();
		}

		// Set the data attribute to the recipe object we recieve
		this._data = data;

		// Get markup
		const markup = this._generateMarkup();

		if (!render) {
			return markup;
		}

		// Clear the parent element
		this._clear();

		// Insert the generated markup into the parent element
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	update(data) {
		// Set the data attribute to the recipe object we recieve
		this._data = data;

		// Create new HTML markup based on the data (each view has its own generateMarkup method)
		const newMarkup = this._generateMarkup();

		// Create a new virtual dom from this markup
		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);

		// Get all elements from the real DOM and virtual DOM and store as an array
		const newElements = Array.from(newDOM.querySelectorAll("*"));
		const curElements = Array.from(
			this._parentElement.querySelectorAll("*")
		);

		// For each virtual DOM element, get the element and index
		newElements.forEach((newEl, i) => {
			// Get the current element in the real DOM as it will be in the same location as in the virtual DOM
			const curEl = curElements[i];

			// If the newEl is not the same as the current element and the textContent is not empty
			// Change the textcontent of the current element to that of the new element, updating it
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ""
			) {
				curEl.textContent = newEl.textContent;
			}

			// If the newEl is not the same as the curEl
			if (!newEl.isEqualNode(curEl)) {
				// Get all the attributes of the newEland store as an array
				Array.from(newEl.attributes).forEach((attr) =>
					// For each attribute update the currentEl by setting its attributes to that of the newEl
					curEl.setAttribute(attr.name, attr.value)
				);
			}
		});
	}

	// Inserts a spinner to the parent element
	renderSpinner() {
		const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;

		// Clear parent element
		this._clear();

		// Add the spinner HTML
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderError(message = this._errorMessage) {
		// Clear parent element
		this._clear();

		// Markup for error
		const markup = `
            <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`;

		// Add error message to parent element
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderMessage(message = this._message) {
		// Clear parent element of view from which this is called
		this._clear();

		// Markup for message
		const markup = `
                <div class="message">
                    <div>
                        <svg>
                            <use href="${icons}#icon-smile"></use>
                        </svg>
                    </div>
                    <p>
                        ${message}
                    </p>
                </div>`;

		// Add message to parent element of view from which this is called
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}

import View from "./View.js";
import icons from "url:../../img/icons.svg";

// For common functionality of resultsView and bookmarksView
// Helps maintain DRY principal

class PreviewView extends View {
	_parentElement = "";

	_generateMarkup() {
		// Get ID of recipe by taking the hash from the url and removing the # symbol
		const id = window.location.hash.slice(1);

		// Return markup from the object containing recipe preview info, passed in from recipeView or bookmarksView
		return `
        <li class="preview">
            <a class="preview__link ${
				this._data.id === id ? "preview__link--active" : ""
			}" href="#${this._data.id}">
                <figure class="preview__fig">
                    <img src="${this._data.image}" alt="${this._data.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${this._data.title}</h4>
                    <p class="preview__publisher">${this._data.publisher}</p>

                    <div class="recipe__user-generated ${
						this._data.key ? "" : "hidden"
					}">
                        <svg>
                            <use href="${icons}#icon-user"
                        </svg>
                    </div>
                </div>
            </a>
        </li>
        `;
	}
}

// Export a new PreviewView object
export default new PreviewView();

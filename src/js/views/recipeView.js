import View from "./View.js";

// Import icons svg for Parcel
import icons from "url:../../img/icons.svg";

// Import npm module for converting decimals to fractions
import fracty from "fracty";

class RecipeView extends View {
	_parentElement = document.querySelector(".recipe");
	_errorMessage = "We couldn't find that recipe. Please try another one!";
	_message = "";

	// Generates HTML for recipe (recipe info stored in _data of View)
	_generateMarkup() {
		return `        
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
			this._data.title
		}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
				this._data.cookingTime
			}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
				this._data.servings
			}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
					this._data.servings - 1
				}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
					this._data.servings + 1
				}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
            <svg>
              <use href="${icons}#icon-user"
            </svg>
          </div>

          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
			this._data.bookmarked ? "-fill" : ""
		}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
				this._data.publisher
			}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
	}

	// Generates markup for an ingredient based on the ingredient object passed in
	_generateMarkupIngredient(ing) {
		return `            
                <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                        <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${
						ing.quantity ? fracty(ing.quantity) : ""
					}</div>
                    <div class="recipe__description">
                        <span class="recipe__unit">${ing.unit}</span> ${
			ing.description
		}
                    </div>
                </li>`;
	}

	// Calls the controlRecipies() function in the controller from the view
	addHandlerRender(handler) {
		// For each of the events in the array, listen for the event and add the handler for it
		["hashchange", "load"].forEach((event) =>
			window.addEventListener(event, handler)
		);
	}

	addHandlerUpdateServings(handler) {
		// Add a click handler to the parentElement of recipeView
		this._parentElement.addEventListener("click", function (e) {
			// Find the closest parent element with class .btn--update-servings as this is the update servings button
			const btn = e.target.closest(".btn--update-servings");

			// If they clicked outside of the button, return
			if (!btn) {
				return;
			}

			// Get the number to update the servings to from the button's dataset
			const updateTo = Number(btn.dataset.updateTo);

			// If updateTo is more than 0 to prevent servings of 0 or less,
			// run the controlServings function from the controller that was passed in
			if (updateTo > 0) {
				handler(updateTo);
			}
		});
	}

	addHandlerAddBookmark(handler) {
		this._parentElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--bookmark");

			if (!btn) {
				return;
			}

			handler();
		});
	}
}

// Export a new RecipeView object
export default new RecipeView();

import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
	// Select all necessary elements from html
	_parentElement = document.querySelector(".upload");
	_message = "Recipe was successfully uploaded";

	_window = document.querySelector(".add-recipe-window");
	_overlay = document.querySelector(".overlay");
	_btnOpen = document.querySelector(".nav__btn--add-recipe");
	_btnClose = document.querySelector(".btn--close-modal");

	// Constructors run as soon as the class is created
	constructor() {
		super(); // Inherit all properties from parent

		// Add event handlers
		this._addHandlerShowWindow();
		this._addHandlerHideWindow();
	}

	// Handlers for showing and hiding the window
	// Have to bind this as the this keyword points to the window by default
	_addHandlerShowWindow() {
		this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
	}

	_addHandlerHideWindow() {
		this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
		this._overlay.addEventListener("click", this.toggleWindow.bind(this));
	}

	// Toggle window function for hididng and showing the window tiself
	toggleWindow() {
		this._overlay.classList.toggle("hidden");
		this._window.classList.toggle("hidden");
	}

	// Handle form submission
	addHandlerUpload(handler) {
		this._parentElement.addEventListener("submit", function (e) {
			// Prevent default behaviour
			e.preventDefault();

			// Get form data as an object where the key is the input name and the value is the input value
			const data = Object.fromEntries([...new FormData(this)]);

			// Pass data onto handler: controlAddRecipe()
			handler(data);
		});
	}

	_generateMarkup() {}
}

// Export a new AddRecipeView
export default new AddRecipeView();

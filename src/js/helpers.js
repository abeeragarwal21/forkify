import { async } from "regenerator-runtime";
import { TIMEOUT_SECONDS } from "./config.js";

// Timeout function returning a rejected promise after 10 seconds to time out api calls
const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(
					`Request took too long! Timed out after ${s} second(s)`
				)
			);
		}, s * 1000);
	});
};

export const AJAX = async function (url, uploadData = undefined) {
	try {
		const fetchPro = uploadData
			? fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(uploadData),
			  })
			: fetch(url);

		// Fetch recipe with recipe id
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

		// Get data from response using .json()
		const data = await res.json();

		// If there's an error with the response throw an error
		if (!res.ok) {
			throw new Error(`${data.message} (${res.status})`);
		}

		return data;
	} catch (err) {
		throw err;
	}
};

// export const getJSON = async function (url) {
// 	try {
// 		// Fetch recipe with recipe id
// 		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);

// 		// Get data from response using .json()
// 		const data = await res.json();

// 		// If there's an error with the response throw an error
// 		if (!res.ok) {
// 			throw new Error(`${data.message} (${res.status})`);
// 		}

// 		// Return data as fulfilled promise value
// 		return data;
// 	} catch (err) {
// 		// If there's an error rethrow it to handle where we are calling this function
// 		throw err;
// 	}
// };

// export const sendJSON = async function (url, uploadData) {
// 	try {
// 		const fetchPro = fetch(url, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(uploadData),
// 		});

// 		// Fetch recipe with recipe id
// 		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

// 		// Get data from response using .json()
// 		const data = await res.json();

// 		// If there's an error with the response throw an error
// 		if (!res.ok) {
// 			throw new Error(`${data.message} (${res.status})`);
// 		}

// 		// Return data as fulfilled promise value
// 		return data;
// 	} catch (err) {
// 		// If there's an error rethrow it to handle where we are calling this function
// 		throw err;
// 	}
// };

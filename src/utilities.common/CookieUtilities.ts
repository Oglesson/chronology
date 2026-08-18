// Returns the value of the named cookie from document.cookie, or undefined if not found
export const getCookieValue = (v: string) => {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${v}=`))
		?.split("=")[1];
};

// Expires the named cookie immediately, effectively deleting it
export const deleteCookie = (v: string) => {
	document.cookie = `${v}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

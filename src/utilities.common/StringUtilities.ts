// Inserts a space before each capital letter in a camelCase string
export const splitWords = (s: string) => s.replace(/([a-z])([A-Z])/g, "$1 $2");

// Converts a space-separated string to camelCase; use isSingleWord to just lowercase the first character
export const toCamelCase = (str: string, isSingleWord: boolean = false) => {
	if (isSingleWord) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}

	const ans = str.toLowerCase();

	return ans
		.split(" ")
		.reduce((s, c) => s + (c.charAt(0).toUpperCase() + c.slice(1)));
};

// Converts any string (camel, pascal, spaces) to kebab-case
export const toKebabCase = (s: string) =>
	s &&
	s
		.toString()
		.match(
			/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
		)
		?.map((x) => x.toLowerCase())
		.join("-");

// Converts any string to PascalCase
export const toPascalCase = (s: string) =>
	s &&
	s
		.match(
			/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
		)
		?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
		.join("");

// Replaces %%key%% placeholders in a URL template string with values from object d
export const toLinkUrl = <T>(s: string, d?: T) => {
	return s.replace(/(?:%%)(.+?)(?:%%)/g, (_o: string, m: string) => {
		return d?.[m as keyof typeof d] as string;
	});
};

// Generates sequential question IDs with a type prefix (e.g. "H2", "T3"); iterable for use in loops
export class QuestionIdGenerator {
	#number: number;
	#questionType: "H" | "T" | "";

	constructor(questionType: "H" | "T" | "", startingNumber = 1) {
		this.#questionType = questionType;
		this.#number = startingNumber;
	}

	next() {
		this.#number += 1;
		return `${this.#questionType}${this.#number}`;
	}

	*[Symbol.iterator]() {
		while (true) {
			yield this.next();
		}
	}
}

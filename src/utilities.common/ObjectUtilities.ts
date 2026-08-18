export default class ObjectUtilities {
	// Compares two objects for deep equality by serialising their sorted keys
	public static areEqual = (
		objA: Record<string, unknown>,
		objB: Record<string, unknown>,
	): boolean => {
		return (
			JSON.stringify(this.sortAlphabetically(objA)) ===
			JSON.stringify(this.sortAlphabetically(objB))
		);
	};

	// Returns a fully independent copy of any value, preserving nested objects, arrays, and Dates
	public static deepCopy<T>(source: T): T {
		return Array.isArray(source)
			? (source.map((item) => this.deepCopy(item)) as unknown as T)
			: source instanceof Date
				? (new Date(source.getTime()) as unknown as T)
				: source && typeof source === "object"
					? Object.getOwnPropertyNames(source).reduce(
							(o, prop) => {
								Object.defineProperty(
									o,
									prop,
									Object.getOwnPropertyDescriptor(
										source,
										prop,
									)!,
								);
								o[prop] = this.deepCopy(
									(source as { [key: string]: unknown })[
										prop
									],
								);
								return o;
							},
							Object.create(Object.getPrototypeOf(source)),
						)
					: (source as T);
	}

	// Returns a new object with keys sorted alphabetically (used to normalise objects before comparison)
	public static sortAlphabetically = (
		source: Record<string, unknown>,
	): Record<string, unknown> => {
		return Object.keys(source)
			.sort()
			.reduce((accumulator: Record<string, unknown>, key: string) => {
				accumulator[key] = source[key];

				return accumulator;
			}, {});
	};
	// Returns true if the object has no own enumerable properties
	public static objIsEmpty = (obj: object): boolean => {
		for (const prop in obj) {
			if (Object.hasOwn(obj, prop)) {
				return false;
			}
		}
		return true;
	};
}

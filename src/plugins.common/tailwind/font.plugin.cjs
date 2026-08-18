const plugin = require("tailwindcss/plugin");

/**
 * Creates a Tailwind font configuration array.
 * @param {number} size - Font size in `px`.
 * @param {number} lineHeight - Line height in `px`. Defaults to the font size.
 * @param {number} letterSpacing - Letter spacing in `px`. Defaults to inherit.
 * @returns {Array}
 */
function font(size, lineHeight = size, letterSpacing = null) {
	return [
		rem(size),
		{
			letterSpacing:
				letterSpacing !== null
					? letterSpacingVal(letterSpacing, size)
					: "inherit",
			lineHeight: lineHeight / size,
		},
	];
}

/**
 * Converts a `px` dimension to a `rem` value.
 * @param {number} px
 * @returns {string}
 */
function rem(px) {
	return `${px / 16}rem`;
}

/**
 * Creates an em letter spacing value based on the base rem value.
 * @param {*} $px
 * @param {number} [$context=16]
 * @returns
 */
function letterSpacingVal($px, $context = 16) {
	return `${roundNumber((1 / $context) * $px)}em`;
}

/**
 * Rounds a float to the nearest 12 dp, dropping any uneeded 0's.
 * @param {number} number - Number to be rounded.
 * @param {number} [decimals = 12] - Number of characters to round to.
 * @returns {number}
 */
function roundNumber(number, decimals = 12) {
	var newnumber = new Number(number + "").toFixed(parseInt(decimals));
	return parseFloat(newnumber);
}

function buildFontProfile({ settings, screens = {} }) {
	const utility = {};

	Object.keys(settings).forEach((key) => {
		switch (key) {
			case "base":
				const base = settings[key];
				const size = base[0];
				const properties = base[1];

				utility["fontSize"] = size;
				utility["letterSpacing"] = properties["letterSpacing"];
				utility["lineHeight"] = properties["lineHeight"];

				break;
			case "screens":
				Object.keys(settings["screens"]).forEach((screenKey) => {
					const screenSize = screens[screenKey];

					if (screenSize) {
						let screenUtilityKey;

						if (
							typeof screenSize === "object" &&
							screenSize !== null
						) {
							console.warn(
								"Object media queries are not currently supported."
							);
						} else {
							screenUtilityKey = `@media (min-width: ${screenSize})`;
						}

						const font = settings["screens"][screenKey];
						const size = font[0];
						const properties = font[1];

						utility[screenUtilityKey] = {
							fontSize: size,
							letterSpacing: properties["letterSpacing"],
							lineHeight: properties["lineHeight"],
						};
					}
				});

				break;
			default:
				console.error(`Unknown property: ${key}`);
				break;
		}
	});

	return utility;
}

const FontSizes = plugin(function ({ addUtilities, theme }) {
	const fontConfig = theme("fontSize", {});
	const newUtilities = {};

	Object.keys(fontConfig).forEach((key) => {
		newUtilities[`.text-${key}`] = buildFontProfile({
			settings: fontConfig[key],
			screens: theme("screens", {}),
		});
	});

	addUtilities(newUtilities);
});

module.exports = { FontSizes, font, rem };

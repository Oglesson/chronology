// Converts between inches and centimetres; toCM=true divides by 2.54 (cm→in), toCM=false multiplies (in→cm)
export const convertBetweenInchCM = (
	value: number,
	toCM: boolean = true
): number => {
	if (toCM) {
		return Number(value / 2.54);
	} else {
		return Number(value * 2.54);
	}
};

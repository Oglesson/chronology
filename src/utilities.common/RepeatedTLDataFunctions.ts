// functions specific to chronology data outputs and probably only useful to this app
import { SelectOption } from "../forms.common/Select";
// Filters the cutting type options: leather hides "Exhaustive", non-leather shows only "Exhaustive"
export const filterCuttingTypes = (
	list: SelectOption[],
	isLeather: boolean = false
): SelectOption[] => {
	const filteredList = list.filter((option) => {
		return isLeather
			? option.label !== "Exhaustive"
			: option.label === "Exhaustive";
	});

	return filteredList;
};

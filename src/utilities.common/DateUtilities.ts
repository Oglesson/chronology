import type { DateFilters } from "../api.common/types";
import { format, subWeeks } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const searchFormatStr = "yyyy'-'MM'-'dd";

// Formats a Date to the yyyy-MM-dd string expected by API search parameters
export const formatAPISearchDateFormat = (dateToFormat: Date): string => {
	return format(dateToFormat, searchFormatStr);
};
export const todaysDate = new Date();

// Returns a default DateFilters range of today back 8 weeks for audit searches
export const initialAuditDateParams = (): DateFilters => {
	const DateTo = formatAPISearchDateFormat(todaysDate);
	const DateFrom = formatAPISearchDateFormat(subWeeks(todaysDate, 8));
	return { DateTo, DateFrom };
};
//format Dates from API into a presentable string format
export const formatAPIDateIntoString = (ds: string | undefined): string => {
	return ds ? format(ds, "dd'-'MM'-'yyyy H':'mm':'ss z") : "-";
};

/* for when dates are selected in a non UK country, make sure the dates are
are converted to GMT so the search is accurate against the GMT stored times*/
export const converLocaletoUKTime = (localDate: string | undefined): string => {
	if (localDate) {
		const localStrToDate = new Date(`${localDate}T18:00:00Z`);
		const tz = "Europe/London";
		return formatInTimeZone(localStrToDate, tz, searchFormatStr);
	} else {
		return formatAPISearchDateFormat(todaysDate);
	}
};

/*Compares two dates to see if it's earlier or later to help validate 
date ranges */
export const dateTimeCompare = (
	start: string,
	end: string,
	isEarlier: boolean = true
) => {
	if (start && end) {
		if (isEarlier) {
			return Date.parse(start) < Date.parse(end);
		} else {
			return Date.parse(end) < Date.parse(start);
		}
	} else {
		return false;
	}
};

import {
	createContext,
	ReactNode,
	useState,
	Dispatch,
	SetStateAction,
	useEffect,
	useContext,
} from "react";
import {
	AuditData,
	AuditQueryData,
	AuditFilters,
} from "../../api.common/types";
import { useAuditList } from "../../hooks.queries/useAuditList";
import {
	initialAuditDateParams,
	converLocaletoUKTime,
} from "../../utilities.common/DateUtilities";
import api from "../../api.common";
import { QUERY_KEYS } from "../../constants.common/queryKeys";
import { queryClient } from "../../context.common/GlobalContext";
import { NavigationContext } from "../../context.common/NavigationContext";

type AuditContextType = {
	openFilterModal: boolean;
	setOpenFilterModal: Dispatch<SetStateAction<boolean>>;
	filterValues: AuditFilters;
	setFilterValues: Dispatch<SetStateAction<AuditFilters>>;
	filteredAudits: AuditData[];
	setFilteredAudits: Dispatch<SetStateAction<AuditData[]>>;
	defaultFilterValues: AuditFilters;
};
// eslint-disable-next-line react-refresh/only-export-components
export const AuditContext = createContext<AuditContextType>({
	openFilterModal: false,
	setOpenFilterModal: () => {},
	filterValues: {},
	setFilterValues: () => {},
	filteredAudits: [],
	setFilteredAudits: () => {},
	defaultFilterValues: {},
});

export const AuditContextProvider = ({ children }: { children: ReactNode }) => {
	const { setIsLoading } = useContext(NavigationContext);

	const defaultFilterValues = {
		...initialAuditDateParams(),
		SectionActions: "All",
		Sections: "All",
		User: "",
	};
	const { auditList } = useAuditList(initialAuditDateParams());
	const [openFilterModal, setOpenFilterModal] = useState(false);
	const [filterValues, setFilterValues] = useState<AuditFilters>({
		...defaultFilterValues,
	}); // List of properties being used to filter the data
	const [filteredAudits, setFilteredAudits] = useState<AuditData[]>(auditList ?? []); // the filtered data list to be used on the listing

	useEffect(() => {
		/* go through each property in filterValues object, convert dates
		to GMT local (it present) then do an api call based on filters and 
		set the list (setFilteredAudits)
		*/
		setIsLoading(true);
		const apiSearchValues: AuditQueryData = {};
		(Object.keys(filterValues) as Array<keyof AuditFilters>).forEach((fv) => {
			if (filterValues[fv] !== "" && filterValues[fv] !== "All") {
				if (fv === "DateTo" || fv === "DateFrom") {
					apiSearchValues[fv] = converLocaletoUKTime(
						filterValues[fv],
					);
				} else if (fv === "Sections" || fv === "SectionActions") {
					apiSearchValues[fv] = [{ Name: filterValues[fv] as string }];
				} else {
					apiSearchValues[fv] = filterValues[fv];
				}
			}
		});

		queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.audit_list] });

		api.getAuditList(apiSearchValues).then(
			(result) => {
				setIsLoading(false);
				setFilteredAudits(result.data);
			},
			() => {
				setIsLoading(false);
			},
		);
	}, [filterValues, setIsLoading]);

	return (
		<AuditContext.Provider
			value={{
				openFilterModal,
				setOpenFilterModal,
				filterValues,
				setFilterValues,
				filteredAudits,
				setFilteredAudits,
				defaultFilterValues,
			}}
		>
			{children}
		</AuditContext.Provider>
	);
};

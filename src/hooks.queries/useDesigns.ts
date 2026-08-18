import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { DesignData } from "../api.common/types";
import { designsQuery } from "../queries.common/designsQuery";
import { SelectOption } from "../forms.common/Select";

export const useDesigns = () => {
	const query = useQuery(designsQuery());
	const data = query.data as AxiosResponse<DesignData[]>;
	const styles = data?.data;

	const stylesList = styles?.map((style): SelectOption => {
		return { label: style.Code, value: style.ID };
	});

	return {
		styles,
		styleCodes: styles?.map((style) => style.Code.toLowerCase()),
		stylesList,
	};
};

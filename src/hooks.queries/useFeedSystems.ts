import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { FeedSystemData } from "../api.common/types";
import { SelectOption } from "../forms.common/Select";
import { feedSystemsQuery } from "../queries.common/feedSystemsQuery";

export const useFeedSystems = () => {
	const query = useQuery(feedSystemsQuery());
	const feedSystems: FeedSystemData[] = [];

	if (query?.data) {
		const data = query?.data as AxiosResponse<FeedSystemData[]>;
		feedSystems.push(...data.data);
	}

	const feedSystemOptions = feedSystems?.map((feedSystem): SelectOption => {
		return {
			label: feedSystem.Description.replace("*_", ""),
			value: feedSystem.ID,
		};
	});

	return { feedSystems, feedSystemOptions };
};

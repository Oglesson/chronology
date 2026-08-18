import { useFetcher as useFetcherRRD } from "react-router-dom";
import { ResponseData } from "../api.common/types";

export const useFetcher = () => {
	const fetcher = useFetcherRRD();
	const isFetching =
		fetcher?.state === "loading" || fetcher?.state === "submitting";
	const responseData = fetcher?.data as ResponseData;

	return { fetcher, isFetching, responseData };
};

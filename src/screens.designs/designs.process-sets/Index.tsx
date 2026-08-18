import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { Listing } from "./partials/_Listing";

export const ProcessSets = () => {
	return (
		<AwaitLoaderData>
			<Listing />
		</AwaitLoaderData>
	);
};

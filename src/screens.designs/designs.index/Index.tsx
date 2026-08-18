import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { Listing } from "./partials/_Listing";

export const Styles = () => {
	return (
		<AwaitLoaderData>
			<Listing />
		</AwaitLoaderData>
	);
};

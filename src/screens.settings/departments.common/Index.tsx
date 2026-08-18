import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { Details } from "./partials/_Details";

export const Departments = () => {
	return (
		<AwaitLoaderData>
			<Details />
		</AwaitLoaderData>
	);
};

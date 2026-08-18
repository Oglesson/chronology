import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";
import { Details } from "./partials/_Details";
import { WhereUsed } from "./partials/_WhereUsed";
import { ActionsContextProvider } from "../screens.actions/partials/_ActionsContext";

export const Action = () => (
	<AwaitLoaderData>
		<ActionsContextProvider>
			<Details />
			<WhereUsed />
		</ActionsContextProvider>
	</AwaitLoaderData>
);

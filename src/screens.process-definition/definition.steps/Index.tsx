import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { DefinitionContextProvider } from "../definition.index/partials/_DefinitionContext";
import { Details } from "./partials/_Details";

export const Steps = () => (
	<AwaitLoaderData>
		<DefinitionContextProvider>
			<Details />
		</DefinitionContextProvider>
	</AwaitLoaderData>
);

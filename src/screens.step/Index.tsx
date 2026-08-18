import { useStep } from "../hooks.queries/useStep";
import { Actions } from "./partials/_Actions";
import { AwaitLoaderData } from "../components/common/loader/AwaitLoaderData";

export const Step = () => {
	const { linkActions, leftHandActions, rightHandActions } = useStep();

	return (
		<AwaitLoaderData>
			<div className="relative">
				<Actions
					linkActions={linkActions}
					leftHandActions={leftHandActions}
					rightHandActions={rightHandActions}
				/>
			</div>
		</AwaitLoaderData>
	);
};

import { useProcess } from "../../hooks.queries/useProcess";
import { PathPreview } from "../process.questions/partials/_PathPreview";

export const Path = () => {
	const { Points } = useProcess();

	return (
		<div className="grid-container">
			<div className="col-span-5">
				{Points && Points.length > 0 && (
					<div className="bg-grey-light rounded-md overflow-hidden aspect-6/4">
						<PathPreview path={Points} />
					</div>
				)}
			</div>
		</div>
	);
};

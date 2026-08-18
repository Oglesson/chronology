import Icons from "../../../config.common/Icons";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { RenderIcon } from "../../../utilities.common/RenderIcon";

export const SaveIndicator = () => {
	const { isSaving } = useQuestionsContext();
	if (!isSaving) {
		return <></>;
	}
	return (
		<RenderIcon
			classes="animate-spin-slow"
			icon={Icons.Interface.Loading}
		/>
	);
};

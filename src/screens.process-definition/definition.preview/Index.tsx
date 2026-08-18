import { useTranslation } from "react-i18next";
import { Modal } from "../../components/modal/Modal";
import Icons from "../../config.common/Icons";
import { useToggle } from "../../hooks.common/useToggle";
import { useProcessDefinition } from "../../hooks.queries/useProcessDefinition";
import { RenderIcon } from "../../utilities.common/RenderIcon";
import { PreviewQuestionsContextProvider } from "./partials/_PreviewQuestionsContext";
import { PreviewSteps } from "./partials/_PreviewSteps";

export const Preview = () => {
	const definition = useProcessDefinition();
	const [openModal, setOpenModal] = useToggle(false);
	const { t } = useTranslation();

	return (
		<>
			<button
				onClick={setOpenModal}
				disabled={!definition.Questions?.length}
			>
				Test Definition
			</button>
			<Modal
				alignment="right"
				isOpen={openModal}
				width="w-[calc(100vw-14rem)]"
				height="h-full"
			>
				<button
					className="float-right z-40 -mt-7 transition-opacity duration-200 hover:opacity-60"
					type="button"
					onClick={setOpenModal}
				>
					<span className="sr-only">{t("close")}</span>
					<RenderIcon
						icon={Icons.Interface.Close}
						classes="w-7 h-7"
					/>
				</button>
				<PreviewQuestionsContextProvider>
					<PreviewSteps setOpenModal={setOpenModal} />
				</PreviewQuestionsContextProvider>
			</Modal>
		</>
	);
};

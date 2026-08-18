import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { Create } from "../screens.designs/designs.index/partials/_Create";
import { usePermissionsContext } from "../hooks.common/usePermissionsContext";
import { CreateButton } from "../screens.designs/designs.index/partials/_CreateButton";
import { GenericModal } from "../components/modal/GenericModal";
import { useToggle } from "../hooks.common/useToggle";

export const Index = ({ ...props }) => {
	const { user } = useAuth0();
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const [openModal, setOpenModal] = useToggle(false);

	return (
		<div
			className="absolute z-50 top-0 right-0 flex flex-col w-7/12 max-w-md min-h-screen pt-35 pb-6.5 pointer-events-auto"
			{...props}
		>
			<h1 className="typo-h1 mb-6">
				{t("welcomeBack", {
					defaultValue: "Welcome back,",
				})}{" "}
				{user?.name?.split(" ")[0]}
			</h1>
			{(permissions?.edit || permissions?.admin) && (
				<div className="mt-auto border border-grey-mid rounded-md p-6">
					<h2 className="typo-h3 mb-24">
						{t("createADesign", {
							defaultValue: "Create a Style",
						})}
					</h2>

					<GenericModal
						customContent={
							openModal && (
								<Create
									action="/designs"
									closeAction={setOpenModal}
								/>
							)
						}
						isOpen={openModal}
					/>
					<CreateButton openAction={setOpenModal} />
				</div>
			)}
		</div>
	);
};

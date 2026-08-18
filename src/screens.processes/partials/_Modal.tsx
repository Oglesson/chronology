import { Modal } from "../../components/modal/Modal";
import { ReactNode } from "react";

export const ProcessesModal = (props: { displayForm: ReactNode | null }) => {
	const { displayForm } = props;
	return (
		<Modal isOpen={displayForm ? true : false}>
			{displayForm && displayForm}
		</Modal>
	);
};

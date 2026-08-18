import { ReactNode } from "react";
import { Modal } from "./Modal";

interface GenericModalProps {
	customContent: ReactNode | null;
	isOpen: boolean;
}

export const GenericModal = ({
	customContent,
	isOpen,
	...props
}: GenericModalProps) => {
	return (
		<Modal isOpen={isOpen} {...props}>
			{customContent && customContent}
		</Modal>
	);
};

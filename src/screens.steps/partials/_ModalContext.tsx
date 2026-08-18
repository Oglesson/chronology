import { createContext } from "react";

type ModalContext = {
	openModal: boolean;
	setOpenModal: () => void;
};

export const ModalContext = createContext<ModalContext>({
	openModal: false,
	setOpenModal: () => {},
});

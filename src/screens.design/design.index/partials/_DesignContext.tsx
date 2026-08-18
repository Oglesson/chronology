import { useTranslation } from "react-i18next";
import { createContext, ReactNode, useState } from "react";

type DesignContext = {
	madeInPairsStatus: string | undefined | null;
	setMadeInPairsStatusPicker: (pairsResponse: string) => void;
	costedLabel: string | undefined | null;
};

// eslint-disable-next-line react-refresh/only-export-components
export const DesignContext = createContext<DesignContext>({
	madeInPairsStatus: "",
	setMadeInPairsStatusPicker: () => {},
	costedLabel: "",
});

export const DesignContextProvider = ({ children }: { children: ReactNode }) => {
	const { t } = useTranslation();

	const [madeInPairsStatus, setMadeInPairsStatus] = useState(
		t("no", { defaultValue: "No" })
	);
	const [costedLabel, setCostedLabel] = useState(
		t("costed", {
			defaultValue: "Costed",
		})
	);

	const setMadeInPairsStatusPicker = (pairsResponse: string) => {
		switch (pairsResponse) {
			case "mipsYes":
				setMadeInPairsStatus(t("yes", { defaultValue: "Yes" }));
				setCostedLabel(
					t("pairsCosted", { defaultValue: "Pairs Costed" })
				);
				break;
			case "mipsNo":
				setMadeInPairsStatus(t("no", { defaultValue: "No" }));
				setCostedLabel(
					t("singlesCosted", { defaultValue: "Singles Costed" })
				);
				break;
			case "mipsMixed":
				setMadeInPairsStatus(t("mixed", { defaultValue: "Mixed" }));
				break;
			default:
				setMadeInPairsStatus(t("no", { defaultValue: "No" }));
		}
	};

	return (
		<DesignContext.Provider
			value={{
				madeInPairsStatus,
				setMadeInPairsStatusPicker,
				costedLabel,
			}}
		>
			{children}
		</DesignContext.Provider>
	);
};

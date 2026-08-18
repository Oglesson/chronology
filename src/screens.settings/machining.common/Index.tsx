import { useTranslation } from "react-i18next";
import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import {
	HorizontalTab,
	HorizontalTabs,
} from "../../components/tabs/HorizontalTabs";
import { Amendments } from "../machining.amendments/Index";
import { Machines } from "../machining.machines/Index";
import { useContext } from "react";
import { SystemContext } from "../Layout";
import { usePermissionsContext } from "../../hooks.common/usePermissionsContext";
import {
	PalletStitching,
	StitchingFolding,
} from "../machining.stitching/Index";
import { StitchingModifiers } from "../machining.stitching-modifiers/Index";
import { StitchingCharacteristics } from "../machining.stitching-characteristics/Index";

export const Machining = () => {
	const { setCreateButton } = useContext(SystemContext);
	const { t } = useTranslation();
	const { permissions } = usePermissionsContext();
	const tabs: HorizontalTab[] = [
		{
			content: <Machines />,
			label: t("machines"),
			value: "machines",
		},
		{
			content: <StitchingFolding />,
			label: t("stitching&Folding"),
			value: "stitching-folding",
		},
		{
			content: <PalletStitching />,
			label: t("palletStitching"),
			value: "pallet-stitching",
		},
	];

	if (permissions.admin) {
		tabs.push(
			{
				content: <StitchingModifiers />,
				label: t("stitchingModifiers"),
				value: "stitching-modifiers",
			},
			{
				content: <StitchingCharacteristics />,
				label: t("stitchingCharacteristics"),
				value: "stitching-characteristics",
			},
			{
				content: <Amendments />,
				label: t("amendments"),
				value: "amendments",
			},
		);
	}

	return (
		<AwaitLoaderData>
			<div className="relative">
				<HorizontalTabs
					classes="mb-10 lg:mb-16"
					onChange={(_event, value) => {
						if (value !== "machines") {
							setCreateButton(<></>);
						}

						if (value !== "stitching-modifiers") {
							setCreateButton(<></>);
						}
					}}
					tabs={tabs}
				/>
			</div>
		</AwaitLoaderData>
	);
};

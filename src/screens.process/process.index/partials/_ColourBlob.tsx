import { useTranslation } from "react-i18next";

type ColourBlobProps = {
	colourBlobData: string;
};

type ColourMapType = {
	[key: string]: string;
};

const colourMap: ColourMapType = {
	"va-true": "green",
	"va-false": "decline",
	"tp-S": "chart-purple",
	"tp-M": "chart-blue",
	"tp-C": "chart-yellow",
	"tp-P": "chart-pink",
	"tp-A": "chart-orange",
	"tp-ea": "chart-orange",
};

export const ColourBlob = ({ colourBlobData }: ColourBlobProps) => {
	const { t } = useTranslation();
	return (
		<div
			className={`w-2.5 h-2.5 rounded-full bg-${colourMap[colourBlobData]}`}
		>
			<span className="sr-only">
				{colourBlobData
					? t(colourBlobData, {
							defaultValue: "Yes",
					  })
					: t("notSet", {
							defaultValue: "Not Set",
					  })}
			</span>
		</div>
	);
};

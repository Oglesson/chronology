import { useTranslation } from "react-i18next";
import Icons from "../config.common/Icons";
import { RenderIcon } from "../utilities.common/RenderIcon";

interface LanguageSelectorProps {
	languages?: Record<string, { nativeName: string }>;
}

export const LanguageSelector = ({
	languages = {
		en: { nativeName: "English" },
		zh: { nativeName: "Chinese" },
	},
	...props
}: LanguageSelectorProps) => {
	const { i18n } = useTranslation();
	return (
		<div className="flex items-center relative w-11.25">
			<select
				defaultValue={i18n.language}
				onChange={(e) => i18n.changeLanguage(e.target.value)}
				className="w-full bg-transparent text-button-tertiary uppercase cursor-pointer appearance-none"
				{...props}
			>
				{Object.keys(languages).map((language) => (
					<option key={language} className="text-black">
						{language}
					</option>
				))}
			</select>
			<RenderIcon
				icon={Icons.Interface.ArrowDownSmall}
				classes="absolute right-0 pointer-events-none"
				sizes="w-3.5 h-3.5"
			/>
		</div>
	);
};

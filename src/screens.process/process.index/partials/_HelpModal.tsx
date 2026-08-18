import { useTranslation } from "react-i18next";
import { Help } from "../../../components/help/Help";

export const HelpModal = () => {
	const { t } = useTranslation();

	return (
		<Help
			className="inline-block px-5 py-4 text-button font-medium underline underline-offset-4"
			content={
				<div className="grid-container">
					<h2 className="typo-pullout col-span-10">
						{t("helpModalHeading", {
							defaultValue: "Help",
						})}
					</h2>
					<div className="mt-60 col-span-8 col-start-5">
						<h5 className="typo-h5">
							{t("helpModalHeading1", {
								defaultValue: "Handling:",
							})}
						</h5>
						<p className="typo-h4 mt-6">
							{t("helpModalParagraph1", {
								defaultValue:
									"Handling ends and the task begins with the piece(s) in the centre or at/in the machine. Any movements made during the task are part of the task itself. At the end of the task, the hand is holding or next to the piece(s) ready to move them back to the work area.",
							})}
						</p>
						<ol className="list-decimal list-outside pl-[1.5em] mt-10">
							<li>
								{t("helpModalList1", {
									defaultValue:
										"A batch is moved to the workstation, possiblein a box.",
								})}
							</li>
							<li>
								{t("helpModalList2", {
									defaultValue:
										"Work is moved to the work area - an areas of the workstation adjacent to where the task will be done. Preparations such as removing bands, splitting and sorting happens here.",
								})}
							</li>
							<li>
								{t("helpModalList3", {
									defaultValue:
										"Individual pieces are moved to the centre for a manual task or directly to a machine. There is ONE movement only between each set of finished and new pieces. When two hands are moved at the same time only count ONE movement.",
								})}
							</li>
						</ol>
						<h5 className="typo-h5 mt-16">
							{t("helpModalHeading2", {
								defaultValue: "Task:",
							})}
						</h5>
						<p className="typo-h4 mt-6">
							{t("helpModalParagraph2", {
								defaultValue:
									"This is for all general stitching Processes. The path only described the time the piece is in the stitching machine. Mark all features on the path where they occur.",
							})}
						</p>
					</div>
				</div>
			}
		>
			{t("help", {
				defaultValue: "Help",
			})}
		</Help>
	);
};

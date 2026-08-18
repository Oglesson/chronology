import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useContext } from "react";
import {
	FieldErrorsImpl,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { FeatureData, PathTypes } from "../../../api.common/types";
import { Button } from "../../../components/common/button/Button";
import { Modal } from "../../../components/modal/Modal";
import Icons from "../../../config.common/Icons";
import { Label } from "../../../forms.common/Label";
import { Select, SelectOption } from "../../../forms.common/Select";
import { useProcess } from "../../../hooks.queries/useProcess";
import { useProcessPathFeatureFormSchema } from "../../../hooks.schema/forms";
import { RenderIcon } from "../../../utilities.common/RenderIcon";
import { useMachiningAmendmentsByCategory } from "../../../hooks.queries/useMachiningAmendments";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { useProcessDefinition } from "../../../hooks.queries/useProcessDefinition";
import { QuestionsContext } from "./_QuestionsContext";

type EditPathFeatureProps = {
	openModal: boolean;
	setOpenModal: () => void;
	pathType: PathTypes | null;
	setPathType: Dispatch<SetStateAction<PathTypes | null>>;
	startIndex: number | null;
	setStartIndex: Dispatch<SetStateAction<number | null>>;
};

export const EditPathFeature = ({
	openModal,
	setOpenModal,
	pathType,
	setPathType,
	startIndex,
	setStartIndex,
}: EditPathFeatureProps) => {
	const pathFeatureFormSchema = useProcessPathFeatureFormSchema();
	type PathFeatureFormData = z.infer<typeof pathFeatureFormSchema>;

	const { previewMode, pathsQuestionsState, setPathsQuestionsState } =
		useQuestionsContext();
	const { formHasChanged } = useContext(QuestionsContext);
	const { t } = useTranslation();
	const {
		control,
		getValues,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			pathFeature: [],
		},
		resolver: zodResolver(pathFeatureFormSchema),
	});
	const { fields, append, remove, replace } = useFieldArray({
		control,
		// @ts-expect-error - fieldArray name type mismatch
		name: "pathFeature",
	});

	const onSubmit = (data: PathFeatureFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const definition = useProcessDefinition();
	const process = useProcess();
	const additionalPathFeatures = useMachiningAmendmentsByCategory(
		Number(process?._Type?.CategoryID)
	);

	let pathFeatures:
		| {
				ID?: number;
				Description: string;
		  }[]
		| undefined;
	let allowedPathTypes;

	if (previewMode) {
		pathFeatures = definition?.PathfeaturesSteps?.map((feature) => {
			return {
				ID: feature._Feature.ID,
				Description: feature._Feature.Description,
			};
		});
		allowedPathTypes = definition?.Pathtypes;
	} else {
		pathFeatures =
			process?.FullTaskDefinition?.AllowedPathFeatures?.concat(
				additionalPathFeatures
			);
		allowedPathTypes = process?.FullTaskDefinition?.AllowedPathTypes;
	}

	pathFeatures = pathFeatures
		? pathFeatures
				.filter((f, i) => {
					return (
						pathFeatures?.findIndex((feat) => feat.ID === f.ID) ===
						i
					);
				})
				.sort((f1, f2) => {
					return f1.Description.localeCompare(f2.Description);
				})
		: [];

	const featureErrors = errors as Partial<
		FieldErrorsImpl<PathFeatureFormData>
	>;

	// eslint-disable-next-line react-hooks/incompatible-library
	const selectedFeatures = watch("pathFeature");

	useEffect(() => {
		if (openModal) {
			reset();
		}
	}, [openModal, reset]);

	useEffect(() => {
		if (
			openModal &&
			startIndex !== null &&
			pathsQuestionsState.value[startIndex].Features.length
		) {
			replace(
				pathsQuestionsState.value[startIndex].Features.map(
					(feature) => feature.FeatureID
				)
			);
		}
	}, [openModal, startIndex, pathsQuestionsState, replace]);

	return (
		<>
			<Modal isOpen={openModal}>
				<h2 className="typo-h3 mb-6">
					{t("editAPathFeature", {
						defaultValue: "Edit a Path Feature",
					})}
				</h2>
				<form
					onSubmit={(e) => {
						if (!isValid) {
							handleSubmit(onSubmit, onSubmitError)(e);
							return;
						}

						e.preventDefault();

						const { pathFeature, pathType } = getValues();

						setPathsQuestionsState((previous) => {
							const next =
								structuredClone?.(previous) ||
								JSON.parse(JSON.stringify(previous));

							next.value[startIndex as number].Features =
								pathFeature.reduce((a: FeatureData[], n) => {
									if (typeof n === "number") {
										a.push({
											FeatureID: n,
										});
									}
									return a;
								}, []);

							return next;
						});

						formHasChanged("Points");

						setPathType(pathType);
						setOpenModal();
					}}
				>
					<div className="form-field">
						<Label htmlFor="pathFeature" label={t("features")} />
						{fields.map((field, index) => {
							const error = featureErrors.pathFeature?.[index];
							return (
								<div key={field.id} className="mb-5">
									<div className="flex items-center">
										<div className="w-full [&_.form-field]:mt-0 [&_label]:sr-only">
											<Select
												error={error}
												control={control}
												htmlFor="pathFeature"
												name={`pathFeature.${index}`}
												label={t("features")}
												options={
													pathFeatures?.reduce(
														(
															a: SelectOption[],
															n
														) => {
															const valueIndex =
																selectedFeatures.findIndex(
																	(id) =>
																		id ===
																		n.ID
																);
															if (
																valueIndex ===
																	-1 ||
																valueIndex ===
																	index
															) {
																a.push({
																	label: n.Description,
																	value: n.ID,
																});
															}
															return a;
														},
														[]
													) || []
												}
												placeholder="Select a feature..."
											/>
										</div>

										<button
											className={`text-decline ml-3.5 rounded-sm ${
												fields.length > 0
													? ""
													: "invisible"
											}`}
											type="button"
											onClick={() => {
												remove(index);
											}}
										>
											<span className="sr-only">
												{t("remove")}
											</span>
											<RenderIcon
												classes="block [:hover>&]:hidden [:focus-visible>&]:hidden"
												icon={Icons.Edit.Remove}
											/>
											<RenderIcon
												classes="hidden [:hover>&]:block [:focus-visible>&]:block"
												icon={Icons.Edit.RemoveSolid}
											/>
										</button>
									</div>
								</div>
							);
						})}
						<Button
							icon={Icons.Edit.PlusSmall}
							text="Add a feature"
							type="button"
							style="tertiary"
							onClick={() => {
								append({});
							}}
						/>
					</div>

					<Select
						error={errors.pathType}
						control={control}
						htmlFor="pathType"
						name="pathType"
						label={t("startMethod")}
						options={
							allowedPathTypes?.map((f) => {
								return {
									label: f.Name,
									value: `ptCurve${f.Seq - 1}`,
								};
							}) || []
						}
						defaultValue={pathType || undefined}
					/>

					<div className="flex justify-end items-center mt-12 gap-6">
						<Button
							style="secondary"
							text={t("cancel")}
							onClick={() => {
								setStartIndex(null);
								setOpenModal();
							}}
						/>
						<Button text={t("edit")} type="submit" />
					</div>
				</form>
			</Modal>
		</>
	);
};

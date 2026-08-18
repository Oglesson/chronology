import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Input } from "../../../forms.common/Input";
import { Select } from "../../../forms.common/Select";
import { useFetcher } from "../../../hooks.common/useFetcher";
import {
	useCuttingMethodsNatural,
	useCuttingMethodsSynthetic,
} from "../../../hooks.queries/useCuttingMethods";
import { useCuttingTypes } from "../../../hooks.queries/useCuttingTypes";
import { useFeedSystems } from "../../../hooks.queries/useFeedSystems";
import { useMaterialTypes } from "../../../hooks.queries/useMaterialTypes";
import { useUnits } from "../../../hooks.queries/useUnits";
import { useProcessCuttingQuestionsFormSchema } from "../../../hooks.schema/forms";
import { FormFooter } from "./_FormFooter";
import { CuttingQuestionsState, QuestionsContext } from "./_QuestionsContext";

export const CuttingQuestions = () => {
	const { materialTypeOptions } = useMaterialTypes();
	const { unitOptions } = useUnits();
	const { cuttingTypeOptions } = useCuttingTypes();
	const { cuttingMethodNaturalOptions } = useCuttingMethodsNatural();
	const { cuttingMethodSyntheticOptions } = useCuttingMethodsSynthetic();
	const { feedSystemOptions } = useFeedSystems();
	const processCuttingQuestionsFormSchema =
		useProcessCuttingQuestionsFormSchema();
	type ProcessCuttingQuestionsFormData = z.infer<
		typeof processCuttingQuestionsFormSchema
	>;
	const {
		previewMode,
		activeGroupId,
		setGroupState,
		getGroupState,
		cuttingQuestionsState,
		setCuttingQuestionsState,
		setGroupSubmit,
		setIsSaving,
		generalQuestionsState,
		formHasChanged,
	} = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	const { t } = useTranslation();

	const dataLoading = !(
		materialTypeOptions.length &&
		unitOptions.length &&
		cuttingTypeOptions.length &&
		cuttingMethodNaturalOptions.length &&
		cuttingMethodSyntheticOptions.length &&
		feedSystemOptions.length
	);

	const {
		control,
		getFieldState,
		getValues,
		setValue,
		handleSubmit,
		register,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: dataLoading
			? undefined
			: zodResolver(processCuttingQuestionsFormSchema),
	});

	const onSubmit = (data: ProcessCuttingQuestionsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	const getIsLeather = (label?: string) => {
		return /^Leather/.test(label || "");
	};

	const getIsSyntheticRoll = (label?: string) => {
		return label === "Synthetic (Roll)";
	};

	const defaultCuttingType = cuttingQuestionsState.cuttingType?.value
		? Number(cuttingQuestionsState.cuttingType?.value)
		: undefined;

	const [isLeather, setIsLeather] = useState<boolean>();
	const [isSyntheticRoll, setIsSyntheticRoll] = useState<boolean>();
	const [filteredCuttingTypeOptions, setFilteredCuttingTypeOptions] =
		useState(cuttingTypeOptions);

	const handleBlur = (e: FocusEvent<HTMLInputElement, Step>) => {
		setCuttingQuestionsState((previous) => {
			const next = { ...previous };
			const name = e.target.name as keyof CuttingQuestionsState;
			const { invalid } = getFieldState(name);

			next[name] = {
				value: e.target.value,
				answered: !invalid,
			};

			return next;
		});
		formHasChanged(["Cutting", "Header"]);

		if (
			e.target.name === "depth" ||
			e.target.name === "fabricLength" ||
			e.target.name === "width" ||
			e.target.name === "area"
		) {
			e.currentTarget.value = e.currentTarget.valueAsNumber.toFixed(3);
		}
	};

	const handleChange = (value: string, name: string) => {
		setCuttingQuestionsState((previous) => {
			const next = { ...previous };
			next[name as keyof CuttingQuestionsState] = {
				value: value,
				answered: true,
			};

			return next;
		});

		formHasChanged(["Cutting", "Header"]);
	};

	const handleMaterialChange = (value: number) => {
		const materialTypelabel = materialTypeOptions.find(
			(o) => o.value === value
		)?.label as string | undefined;
		const isItLeather = getIsLeather(materialTypelabel);
		const isSyntheticRoll = getIsSyntheticRoll(materialTypelabel);
		const filteredCuttingTypeOptions = cuttingTypeOptions.filter(
			(option) => {
				return isItLeather
					? option.label !== "Exhaustive"
					: option.label === "Exhaustive";
			}
		);

		const cuttingTypeValue =
			filteredCuttingTypeOptions.find(
				(option) => option.value === defaultCuttingType
			)?.value || filteredCuttingTypeOptions[0]?.value;
		setIsLeather(isItLeather);
		setIsSyntheticRoll(isSyntheticRoll);
		setFilteredCuttingTypeOptions(filteredCuttingTypeOptions);
		setValue("cuttingType", Number(cuttingTypeValue));
	};

	useEffect(() => {
		if (!isValid) {
			setGroupState(activeGroupId as number, "error");
		} else {
			const {
				next,
				group: { isDirty },
			} = getGroupState(activeGroupId as number);
			setGroupState(
				activeGroupId as number,
				!isDirty && next === "incomplete" ? "initial" : next
			);
		}
	}, [errors, isValid, activeGroupId, getGroupState, setGroupState]);

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	useEffect(() => {
		if (!dataLoading) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			handleMaterialChange(getValues("materialType"));
		}
	}, [dataLoading]); // eslint-disable-line react-hooks/exhaustive-deps

	if (dataLoading) {
		return <></>;
	}

	return (
		<fetcher.Form
			onSubmit={(e) => {
				if (!isValid) {
					handleSubmit(onSubmit, onSubmitError)(e);

					return;
				}

				setCuttingQuestionsState((previous) => {
					const next = { ...previous };
					Object.keys(next).forEach(
						(q) =>
							(next[q as keyof CuttingQuestionsState]!.answered =
								true)
					);

					return next;
				});

				setGroupSubmit(true);
			}}
		>
			<div className="form-field__group--inline max-w-lg [&_.form-field>label]:w-1/2">
				<Select
					error={errors.materialType}
					control={control}
					htmlFor="materialType"
					name="materialType"
					label={t("materialType")}
					options={materialTypeOptions}
					defaultValue={
						cuttingQuestionsState.materialType?.value
							? Number(cuttingQuestionsState?.materialType?.value)
							: undefined
					}
					placeholder="Select a value..."
					onChange={(_, v) => {
						handleChange(v, "materialType");
						handleMaterialChange(v);
					}}
				/>
				<Select
					error={errors.cuttingType}
					control={control}
					htmlFor="cuttingType"
					name="cuttingType"
					label={t("cuttingType")}
					options={filteredCuttingTypeOptions}
					defaultValue={defaultCuttingType}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v, "cuttingType")}
				/>
				<Select
					error={errors.unit}
					control={control}
					htmlFor="unit"
					name="unit"
					label={t("unit")}
					options={unitOptions}
					defaultValue={
						cuttingQuestionsState.unit?.value
							? Number(cuttingQuestionsState?.unit?.value)
							: undefined
					}
					placeholder="Select a value..."
					onChange={(_, v) => handleChange(v, "unit")}
				/>
				<Input
					error={errors.unitsPerJob}
					htmlFor={"unitsPerJob"}
					label={
						generalQuestionsState?.madeInPairs?.value === "yes"
							? t("pairsPerJob")
							: t("itemsPerJob")
					}
					name="unitsPerJob"
					defaultValue={cuttingQuestionsState?.unitsPerJob?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
				<Input
					error={errors.sizes}
					htmlFor={"sizes"}
					label={t("sizes")}
					name="sizes"
					defaultValue={cuttingQuestionsState?.sizes?.value?.toString()}
					type="number"
					register={register}
					onBlur={handleBlur}
				/>
				<div className={isLeather ? undefined : "hidden"}>
					<Select
						error={errors.cuttingMethodNatural}
						control={control}
						htmlFor="cuttingMethodNatural"
						name="cuttingMethodNatural"
						label={t("cuttingMethod")}
						options={cuttingMethodNaturalOptions}
						defaultValue={
							cuttingQuestionsState?.cuttingMethodNatural?.value
								? Number(
										cuttingQuestionsState
											?.cuttingMethodNatural?.value
								  )
								: undefined
						}
						placeholder="Select a value..."
						onChange={(_, v) =>
							handleChange(v, "cuttingMethodNatural")
						}
					/>
				</div>
				<div className={!isLeather ? undefined : "hidden"}>
					<Select
						error={errors.cuttingMethodSynthetic}
						control={control}
						htmlFor="cuttingMethodSynthetic"
						name="cuttingMethodSynthetic"
						label={t("cuttingMethod")}
						options={cuttingMethodSyntheticOptions}
						defaultValue={
							cuttingQuestionsState.cuttingMethodSynthetic?.value
								? Number(
										cuttingQuestionsState
											?.cuttingMethodSynthetic?.value
								  )
								: undefined
						}
						placeholder="Select a value..."
						onChange={(_, v) =>
							handleChange(v, "cuttingMethodSynthetic")
						}
					/>
				</div>
				<div
					className={
						!isLeather && isSyntheticRoll ? undefined : "hidden"
					}
				>
					<Select
						error={errors.feedSystem}
						control={control}
						htmlFor="feedSystem"
						name="feedSystem"
						label={t("feedSystem")}
						options={feedSystemOptions}
						defaultValue={
							cuttingQuestionsState?.feedSystem?.value
								? Number(
										cuttingQuestionsState?.feedSystem?.value
								  )
								: undefined
						}
						placeholder="Select a value..."
						onChange={(_, v) => handleChange(v, "feedSystem")}
					/>
				</div>
				<div className={!isLeather ? undefined : "hidden"}>
					<Input
						error={errors.layers}
						htmlFor={"layers"}
						label={t("layers")}
						name="layers"
						defaultValue={cuttingQuestionsState?.layers?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
					/>
				</div>
				<div className={isLeather ? undefined : "hidden"}>
					<Input
						error={errors.area}
						htmlFor={"area"}
						label={t("area")}
						name="area"
						defaultValue={cuttingQuestionsState?.area?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
					/>
				</div>
				<div className={isLeather ? undefined : "hidden"}>
					<Input
						error={errors.coefficient}
						htmlFor={"coefficient"}
						label={t("coefficient")}
						name="coefficient"
						defaultValue={cuttingQuestionsState?.coefficient?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
					/>
				</div>
				<div className={!isLeather ? undefined : "hidden"}>
					<Input
						error={errors.width}
						htmlFor={"width"}
						label={t("width")}
						name="width"
						defaultValue={cuttingQuestionsState?.width?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
					/>
				</div>
				<div
					className={
						!isLeather && !isSyntheticRoll ? undefined : "hidden"
					}
				>
					<Input
						error={errors.fabricLength}
						htmlFor={"fabricLength"}
						label={t("length")}
						name="fabricLength"
						defaultValue={cuttingQuestionsState?.fabricLength?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
					/>
				</div>
				<div className={!isLeather ? undefined : "hidden"}>
					<Input
						error={errors.depth}
						htmlFor={"depth"}
						label={t("strokeDepth")}
						name="depth"
						defaultValue={cuttingQuestionsState?.depth?.value?.toString()}
						type="number"
						register={register}
						onBlur={handleBlur}
					/>
				</div>
			</div>
			<FormFooter />
		</fetcher.Form>
	);
};

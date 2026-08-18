import { zodResolver } from "@hookform/resolvers/zod";
import { FocusEvent, Fragment, useContext, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z, ZodNumber } from "zod";
import { ProcessDefinitionQuestionData } from "../../../api.common/types";
import { CheckableList } from "../../../forms.common/CheckableList";
import { Input } from "../../../forms.common/Input";
import { useFetcher } from "../../../hooks.common/useFetcher";
import { FormFooter } from "./_FormFooter";
import { QuestionCategory } from "../../../hooks.queries/useProcessQuestions";
import { useQuestionsContext } from "../../../hooks.queries/useQuestionsContext";
import { QuestionsContext } from "./_QuestionsContext";

export const DefinitionQuestions = (props: {
	currentGroup: QuestionCategory;
}) => {
	const {
		previewMode,
		activeGroupId,
		setGroupState,
		getGroupState,
		questionsAnswers,
		setQuestionsAnswers,
		setGroupSubmit,
		setIsSaving,
	} = useQuestionsContext();

	const { formHasChanged } = useContext(QuestionsContext);

	const { fetcher, isFetching } = useFetcher();

	const stepValue = (value: number) => {
		let calcvalue = "0";
		if (value && value > 0) {
			const zeroes = value - 1;
			calcvalue = `0.${zeroes > 0 ? calcvalue.repeat(zeroes) : ""}1`;
		}

		return Number(calcvalue);
	};

	const shape = useMemo(() => {
		const s: { [key: string]: ZodNumber } = {};

		for (const question of props.currentGroup.questions) {
			if (!question.QuestionsNumbers) continue;

			const minValue = question.QuestionsNumbers.MinValue;
			const maxValue = question.QuestionsNumbers.MaxValue;
			const invalidTypeMessage = `${question.Description} must contain a number value between ${minValue} and ${maxValue}`;
			const requiredMessage = `${question.Description} must contain a value between ${minValue} and ${maxValue}`;
			const minMessage = `${question.Description} cannot be less than ${minValue}`;
			const maxMessage = `${question.Description} cannot be greater than ${maxValue}`;
			const dpsValue = stepValue(question.QuestionsNumbers.Dps);
			const dpsMessage = `${question.Description} cannot be greater than ${
				question.QuestionsNumbers.Dps
			} decimal place${question.QuestionsNumbers.Dps === 1 ? "" : "s"}`;

			s[question.Code] =
				question.QuestionsNumbers.Dps > 0
					? z
							.number({
								invalid_type_error: invalidTypeMessage,
								required_error: requiredMessage,
							})
							.gte(minValue, minMessage)
							.lte(maxValue, maxMessage)
							.multipleOf(dpsValue, dpsMessage)
					: z
							.number({
								invalid_type_error: invalidTypeMessage,
								required_error: requiredMessage,
							})
							.int()
							.gte(minValue, minMessage)
							.lte(maxValue, maxMessage);
		}

		return s;
	}, [props.currentGroup.questions]);

	const definitionQuestionsFormSchema = z.object(shape);
	type DefinitionQuestionsFormData = z.infer<
		typeof definitionQuestionsFormSchema
	>;

	const {
		handleSubmit,
		register,
		getFieldState,
		trigger,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(definitionQuestionsFormSchema),
	});

	useEffect(() => {
		const invalid = !!Object.keys(shape).find(
			(s) => getFieldState(s).invalid
		);
		if (invalid) {
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
	}, [errors, isValid, activeGroupId, getFieldState, getGroupState, setGroupState, shape]);

	useEffect(() => {
		if (!previewMode) {
			setIsSaving(isFetching);
		}
	}, [isFetching, previewMode, setIsSaving]);

	useEffect(() => {
		(document?.activeElement as HTMLElement)?.blur();
		trigger(undefined, { shouldFocus: true });
	}, [activeGroupId, trigger]);

	if (!props.currentGroup) {
		return <></>;
	}

	const definitionQuestionsAnswers = questionsAnswers.filter((q) =>
		props.currentGroup.questions.find((c) => c.Code === q.Code)
	);

	const handleBlur = (
		e: FocusEvent<HTMLInputElement, Step>,
		dp?: number
	) => {
		setQuestionsAnswers((previous) => {
			const next = [...previous];

			const name = e.target.name;
			const index = next.findIndex((q) => q.Code === name);
			const { invalid } = getFieldState(name);

			next[index] = {
				...next[index],
				ValueOrIndex: Number(e.target.value),
				Answered: !invalid,
			};
			return next;
		});
		if (dp) {
			e.currentTarget.value = e.currentTarget.valueAsNumber.toFixed(dp);
		}

		formHasChanged("QuestionsAnswers");
	};

	const handleChange = () => {
		formHasChanged("QuestionsAnswers");
	};

	const renderQuestion = (question: ProcessDefinitionQuestionData) => {
		let dpValue: number | string | undefined =
			definitionQuestionsAnswers.find(
				(q) => q.Code === question.Code
			)?.ValueOrIndex;

		if (question.QuestionsNumbers) {
			dpValue = dpValue?.toFixed(question.QuestionsNumbers.Dps);
			return (
				<Input
					error={errors[question.Code]}
					label={question.Description}
					name={question.Code}
					htmlFor={question.Code}
					register={register}
					defaultValue={dpValue}
					type="number"
					onBlur={(e) =>
						handleBlur(e, question?.QuestionsNumbers?.Dps)
					}
					onChange={() => handleChange()}
				/>
			);
		}

		if (question.QuestionsChoices) {
			return (
				<CheckableList
					label={question.Description}
					register={register}
					items={question.QuestionsChoices.map((choice) => {
						return {
							htmlFor: `${choice.ChoiceValue}-${question.Code}`,
							label: choice.ChoiceValue,
							name: question.Code,
							value: choice.ChoiceIndex,
							isDefault: choice.ChoiceIndex === dpValue,
						};
					})}
					type="radio"
					onBlur={handleBlur}
					onChange={() => handleChange()}
				/>
			);
		}

		return <></>;
	};

	const onSubmit = (data: DefinitionQuestionsFormData) => console.log(data);
	const onSubmitError = (data: object) => console.error(data);

	return (
		<fetcher.Form
			onSubmit={(e) => {
				if (!isValid) {
					handleSubmit(onSubmit, onSubmitError)(e);
					return;
				}

				setQuestionsAnswers((previous) => {
					const next = [...previous];

					props.currentGroup.questions.forEach((c) => {
						const q = next.find((q) => q.Code === c.Code);
						if (q) {
							q.Answered = true;
						}
					});
					return next;
				});
				formHasChanged("QuestionsAnswers");

				setGroupSubmit(true);
			}}
		>
			<div className="form-field__group--inline max-w-lg [&_.form-field>label]:w-1/2">
				{props.currentGroup.questions.map((question) => (
					<Fragment key={question.Code}>
						{renderQuestion(question)}
					</Fragment>
				))}
			</div>
			<FormFooter />
		</fetcher.Form>
	);
};

import { Fragment, useState } from "react";
import "./level.scss";

export type LevelProps = {
	callback: (value: number) => void;
	disableEdit?: boolean;
	max: number;
	min: number;
	name: string;
	steps: {
		[key: number]: string;
	};
	value: number;
};

export const Level = ({
	callback,
	disableEdit,
	max,
	min,
	name,
	steps,
	value,
	...props
}: LevelProps) => {
	const [displayValue, setDisplayValue] = useState<number | null>(null);

	return (
		<div className="level" {...props}>
			<fieldset className="level__fieldset">
				{[...Array(max - (min - 1))].map((_x, index) => {
					const levelIndex = index + min;
					const stepLabel = steps[levelIndex];
					return (
						<Fragment key={index}>
							<label
								className={`level__label ${
									stepLabel ? "visible" : "invisible"
								}`}
								htmlFor={`${name}-${levelIndex}`}
							>
								{stepLabel && (
									<span className="level__label-heading">
										{stepLabel}
									</span>
								)}
								<span className="level__label-value">
									{levelIndex}
								</span>
							</label>
							<input
								className={`level__input${
									disableEdit ? " !pointer-events-none" : ""
								}`}
								id={`${name}-${levelIndex}`}
								name={name}
								disabled={disableEdit}
								type="radio"
								checked={levelIndex === value}
								defaultValue={levelIndex}
								onChange={() => {
									callback(levelIndex);
								}}
								onMouseOver={() => {
									if (disableEdit) {
										return;
									}
									setDisplayValue(levelIndex);
								}}
								onMouseOut={() => {
									setDisplayValue(null);
								}}
							/>
						</Fragment>
					);
				})}
			</fieldset>
			<div className="flex justify-end align-top gap-x-2.5 mt-8 typo-h1">
				<span>{displayValue || value}</span>{" "}
				<span className="text-grey-mid">/</span>{" "}
				<span className="typo-h4">{max}</span>
			</div>
		</div>
	);
};

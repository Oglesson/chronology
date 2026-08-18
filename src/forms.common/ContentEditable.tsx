import { Popper } from "@mui/base";
import { ModifierArguments, State } from "@popperjs/core";
import { useEffect, useRef, useState, useCallback } from "react";
import {
	Control,
	FieldError,
	FieldValues,
	Path,
	PathValue,
	useController,
} from "react-hook-form";
import { FormError } from "./FormError";
import { Label } from "./Label";
import { SelectOption } from "./Select";

type ContentEditableProps<T extends FieldValues> = {
	control: Control<T>;
	defaultValue?: PathValue<T, Path<T>>;
	error?: FieldError;
	htmlFor: string;
	label?: string;
	maxHeight?: number;
	name: Path<T>;
	options: SelectOption[];
	placeholder?: string;
};

export const ContentEditable = <T extends FieldValues>({
	control,
	defaultValue,
	error,
	label,
	maxHeight,
	name,
	options,
	placeholder,
	...props
}: ContentEditableProps<T>) => {
	const {
		field: { onBlur, onChange, ref, value },
	} = useController({
		name,
		control,
		defaultValue: defaultValue ?? ("" as PathValue<T, Path<T>>),
	});

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [optionIndex, setOptionIndex] = useState<number | null>(null);
	const selection = window.getSelection();
	const range = document.createRange();
	const divRef = useRef<HTMLDivElement>(null);

	const getCaret = (Element: HTMLElement) => {
		const childNodes = [...Element.childNodes];
		const anchorNode = selection?.anchorNode as ChildNode;
		const anchorOffset = selection?.anchorOffset || 0;
		const anchorNodeIndex = childNodes.indexOf(anchorNode);
		const focusNode = selection?.focusNode as ChildNode;
		const focusOffset = selection?.focusOffset || 0;
		const focusNodeIndex = childNodes.indexOf(focusNode);

		const options = {
			anchorNode: anchorNode,
			anchorNodeIndex: anchorNodeIndex,
			anchorOffset: anchorOffset,
			anchorHTMLOffset: anchorOffset,
			anchorTextOffset: anchorOffset,
			focusNode: focusNode,
			focusNodeIndex: focusNodeIndex,
			focusOffset: focusOffset,
			focusHTMLOffset: focusOffset,
			focusTextOffset: focusOffset,
		};

		if (anchorNodeIndex === -1) {
			return options;
		}

		const anchorOptions = {
			...childNodes.slice(0, anchorNodeIndex)?.reduce(
				(a, n) => {
					return {
						...a,
						anchorHTMLOffset:
							a.anchorHTMLOffset +
							(
								((n as HTMLElement).outerHTML ||
									n.textContent) as string
							).length,
						anchorTextOffset:
							a.anchorTextOffset +
							(n.textContent as string).length,
					};
				},
				{
					anchorHTMLOffset: anchorOffset,
					anchorTextOffset: anchorOffset,
				},
			),
		};

		const focusOptions = {
			...childNodes.slice(0, focusNodeIndex)?.reduce(
				(a, n) => {
					return {
						...a,
						focusHTMLOffset:
							a.focusHTMLOffset +
							(
								((n as HTMLElement).outerHTML ||
									n.textContent) as string
							).length,
						focusTextOffset:
							a.focusTextOffset +
							(n.textContent as string).length,
					};
				},
				{
					focusHTMLOffset: focusOffset,
					focusTextOffset: focusOffset,
				},
			),
		};

		return {
			...options,
			...anchorOptions,
			...focusOptions,
		};
	};

	const selectTag = (node: ChildNode) => {
		const previousSibling = node.previousSibling;
		const nextSibling = node.nextSibling;
		if (previousSibling && nextSibling) {
			range.setStart(
				node.previousSibling,
				(node.previousSibling?.textContent?.length as number) - 1,
			);
			range.setEnd(node.nextSibling, 1);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	};

	const addTag = (option: SelectOption) => {
		const currentTarget = divRef?.current;
		if (!currentTarget) {
			return;
		}

		currentTarget.focus();

		document.execCommand("insertHTML", false, renderButton(option));

		const newButton = (selection?.anchorNode as Element)
			.previousElementSibling as HTMLElement;

		newButton.scrollIntoView({
			block: "nearest",
			inline: "nearest",
		});
	};

	const clampSelection = (node: Node, nodes: ChildNode[], offset: number) => {
		if (!nodes.includes(node as ChildNode)) {
			return null;
		}
		const previousElement = (node as Element).previousElementSibling;
		const previousSibling = node.previousSibling;
		const nextElement = (node as ChildNode & Element).nextElementSibling;
		const nextSibling = node.nextSibling;
		const textLength = node.textContent?.length as number;
		const min =
			nodes.includes(previousElement as ChildNode) &&
			previousElement === previousSibling
				? 1
				: 0;
		const max =
			nodes.includes(nextElement as ChildNode) &&
			nextElement === nextSibling
				? textLength - 1
				: textLength;
		const clampOffset = Math.min(Math.max(offset, min), max);
		if (offset < min || offset > max) {
			return clampOffset;
		}
		return null;
	};

	const handleSelectionChange = (_event: Event) => {
		if (!selection) {
			return;
		}
		const target = divRef.current as ChildNode;
		const childNodes = [...(target.childNodes || [])].filter((node) => {
			return node.nodeName !== "BR";
		});
		childNodes.forEach((node) => {
			if (node.nodeType === 1) {
				const containsNode = selection.containsNode(node);
				(node as Element).classList.toggle(
					"form-contenteditable__tag--selected",
					containsNode,
				);
			}
		});
	};

	const renderButton = (option: SelectOption) => {
		return `&ZeroWidthSpace;<button class="form-contenteditable__tag" contentEditable="false" unselectable="on" tabindex="-1" type="button" data-value="${option.value}">${option.label}</button>&ZeroWidthSpace;`;
	};

	const formatValue = useCallback(
		(value: string) => {
			return value
				.replace(/(G|H|M|T)\d+/g, (r) => {
					const option = options.find((option) => option.value === r);
					return option ? renderButton(option) : r;
				})
				.replace(
					/(&ZeroWidthSpace;\s|\s&ZeroWidthSpace;)/g,
					"&ZeroWidthSpace;",
				);
		},
		[options],
	);

	useEffect(() => {
		if (isOpen) {
			divRef.current?.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (defaultValue && divRef.current) {
			divRef.current.innerHTML = formatValue(defaultValue) as string;
		}
	}, [defaultValue, formatValue]);

	useEffect(() => {
		if (options.length) {
			document.addEventListener("selectionchange", handleSelectionChange);
			return () => {
				document.removeEventListener(
					"selectionchange",
					handleSelectionChange,
				);
			};
		}
	}, []);

	if (!options.length) {
		return <></>;
	}

	return (
		<>
			<div className="form-field" {...props}>
				{label && <Label label={label} />}
				<div
					className={`form-input form-input--no-padding${
						error ? " form-input--error" : ""
					}`}
					onFocus={() => {
						setIsOpen(true);
					}}
					onBlur={(event) => {
						if (
							!event.currentTarget.contains(event.relatedTarget)
						) {
							setIsOpen(false);
							setOptionIndex(null);
						}
					}}
				>
					<div
						ref={divRef}
						className="form-contenteditable"
						suppressContentEditableWarning={true}
						contentEditable
						spellCheck="false"
						onBlur={(event) => {
							const currentTarget = event.currentTarget;
							const childNodes = [...currentTarget.childNodes];
							const value = childNodes
								.reduce((a, n) => {
									if (n.nodeType !== 1) {
										return a + n.textContent;
									}
									return (
										a +
										((n as HTMLElement)?.dataset?.value ||
											n.textContent)
									);
								}, "")
								.replace(/[\u200B\s]+/g, " ")
								.trim();
							onChange(value);
							onBlur();
						}}
						onClick={(event) => {
							const currentTarget = event.currentTarget;
							const target = event.target as Element;
							setIsOpen(true);
							if (target !== currentTarget) {
								selectTag(target);
								target.scrollIntoView({
									block: "nearest",
									inline: "nearest",
								});
							}
						}}
						onDragStart={(event) => {
							event.preventDefault();
						}}
						onDrop={(event) => {
							event.preventDefault();
						}}
						onKeyDown={(event) => {
							const currentTarget = event.currentTarget;
							const key = event.key;
							const innerHTML = currentTarget.innerHTML;
							const textContent = currentTarget.textContent;
							const { focusNode, focusHTMLOffset } =
								getCaret(currentTarget);

							if (key === "Enter") {
								event.preventDefault();
								if (optionIndex !== null) {
									addTag(options[optionIndex]);
								}
								setIsOpen(true);
							} else if (key === "Escape") {
								event.preventDefault();
								setIsOpen(false);
								setOptionIndex(null);
							} else if (
								key === "ArrowLeft" ||
								key === "Backspace"
							) {
								if (textContent?.length) {
									const previousElement = (
										focusNode as Element
									).previousElementSibling;

									if (previousElement) {
										const charsBefore = innerHTML.substring(
											innerHTML.lastIndexOf(
												">",
												focusHTMLOffset,
											) + 1,
											focusHTMLOffset,
										);
										const realCharsBefore =
											charsBefore.replace(/\u200B/g, "");

										if (realCharsBefore.length === 0) {
											if (event.shiftKey) {
												selection?.modify(
													"extend",
													"backward",
													"word",
												);
											} else if (
												selection?.toString().length ===
												0
											) {
												event.preventDefault();
												selectTag(previousElement);
											}
										}
									}
								}
							} else if (
								key === "ArrowRight" ||
								key === "Delete"
							) {
								if (textContent?.length) {
									const nextElement = (focusNode as Element)
										.nextElementSibling;

									if (nextElement) {
										const charsAfter = innerHTML.substring(
											innerHTML.indexOf(
												"<",
												focusHTMLOffset,
											),
											focusHTMLOffset,
										);
										const realCharsAfter =
											charsAfter.replace(/\u200B/g, "");

										if (realCharsAfter.length === 0) {
											if (event.shiftKey) {
												event.preventDefault();

												selection?.modify(
													"extend",
													"forward",
													"word",
												);
												selection?.modify(
													"extend",
													"forward",
													"character",
												);
											} else if (
												selection?.toString().length ===
												0
											) {
												event.preventDefault();
												selectTag(nextElement);
											}
										}
									}
								}
							} else if (key === "ArrowUp") {
								event.preventDefault();
								if (isOpen) {
									setOptionIndex((oldIndex) => {
										const newIndex =
											oldIndex === null
												? options.length - 1
												: oldIndex - 1 < 0
													? options.length - 1
													: oldIndex - 1;

										return newIndex;
									});
								} else {
									setIsOpen(true);
								}
							} else if (key === "ArrowDown") {
								event.preventDefault();
								if (isOpen) {
									setOptionIndex((oldIndex) => {
										const newIndex =
											oldIndex === null
												? 0
												: oldIndex + 1 >
													  options.length - 1
													? 0
													: oldIndex + 1;

										return newIndex;
									});
								} else {
									setIsOpen(true);
								}
							}
						}}
						onPaste={(event) => {
							event.preventDefault();
							const text =
								event.clipboardData.getData("text/plain");
							const cleanText = text.replace(/[\n\r]/g, "");
							document.execCommand(
								"insertText",
								false,
								cleanText,
							);
						}}
						onSelect={(event) => {
							if (!selection) {
								return;
							}

							const currentTarget = event.currentTarget;
							const childNodes = [
								...currentTarget.childNodes,
							].filter((node) => {
								return node.nodeName !== "BR";
							});

							const {
								anchorNode,
								anchorOffset,
								focusNode,
								focusOffset,
							} = selection;

							if (
								anchorNode &&
								focusNode &&
								anchorNode.nodeType === 3 &&
								focusNode.nodeType === 3 &&
								childNodes.includes(anchorNode as ChildNode) &&
								childNodes.includes(focusNode as ChildNode)
							) {
								const clampAnchor = clampSelection(
									anchorNode,
									childNodes,
									anchorOffset,
								);
								const clampFocus = clampSelection(
									focusNode,
									childNodes,
									focusOffset,
								);

								if (
									clampAnchor !== null ||
									clampFocus !== null
								) {
									selection.setBaseAndExtent(
										anchorNode,
										clampAnchor || anchorOffset,
										focusNode,
										clampFocus || focusOffset,
									);
								}
							}
						}}
					>
						{defaultValue}
					</div>
					<input
						className="sr-only"
						name={name}
						onFocus={() => {
							divRef.current?.focus();
						}}
						readOnly
						ref={ref}
						tabIndex={-1}
						type="text"
						value={value}
						placeholder={placeholder}
					/>
					<Popper
						open={isOpen}
						anchorEl={() => divRef.current!}
						disablePortal={true}
						popperOptions={{
							placement: "bottom",
							modifiers: [
								{
									name: "dimensions",
									enabled: true,
									fn: ({
										state,
									}: ModifierArguments<State>) => {
										state.styles.popper.width = `${state.rects.reference.width}px`;
										state.styles.popper.maxHeight = `${Math.floor(
											Math.min(
												Math.max(
													84,
													window.innerHeight -
														(state.rects.reference
															.y +
															state.rects
																.reference
																.height +
															20),
												),
												maxHeight ?? 300,
											),
										)}px`;
									},
									phase: "beforeWrite",
									requires: ["computeStyles"],
								},
							],
							strategy: "fixed",
						}}
						slotProps={{
							root: {
								className: "select__popper",
							},
						}}
					>
						<ul className="select__listbox" tabIndex={-1}>
							{options.map((option, index) => {
								return (
									<li
										key={`${option.value}`}
										className={`MuiOption option ${
											index === optionIndex
												? "MuiOption-highlighted"
												: ""
										}`}
										onClick={(event) => {
											event.preventDefault();
											addTag(options[index]);
											setOptionIndex(index);
										}}
									>
										{option.label}
									</li>
								);
							})}
						</ul>
					</Popper>
				</div>
				<FormError error={error} />
			</div>
		</>
	);
};

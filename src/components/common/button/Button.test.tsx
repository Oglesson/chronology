import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
	it("renders button text", () => {
		render(<Button text="Click me" />);
		expect(
			screen.getByRole("button", { name: "Click me" })
		).toBeInTheDocument();
	});

	it("defaults to type=button", () => {
		render(<Button text="Click me" />);
		expect(screen.getByRole("button")).toHaveAttribute("type", "button");
	});

	it("renders as submit type when specified", () => {
		render(<Button text="Submit" type="submit" />);
		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});

	it("calls onClick handler when clicked", async () => {
		const onClick = jest.fn();
		render(<Button text="Click me" onClick={onClick} />);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled when disabled prop is set", () => {
		render(<Button text="Click me" disabled />);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("does not call onClick when disabled", async () => {
		const onClick = jest.fn();
		render(<Button text="Click me" disabled onClick={onClick} />);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("hides text visually when iconOnly is set", () => {
		const mockIcon = { path: "/icons/test.svg" };
		render(<Button text="Add item" iconOnly icon={mockIcon} />);
		expect(screen.getByText("Add item")).toHaveClass("sr-only");
	});

	it("applies a custom className", () => {
		render(<Button text="Click me" className="my-custom-class" />);
		expect(screen.getByRole("button")).toHaveClass("my-custom-class");
	});
});

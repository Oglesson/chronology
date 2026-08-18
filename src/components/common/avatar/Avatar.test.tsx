import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
	it("renders an image when src is provided", () => {
		render(
			<Avatar src="https://example.com/avatar.jpg" altText="User avatar" />
		);
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
		expect(img).toHaveAttribute("alt", "User avatar");
	});

	it("renders a fallback SVG icon when no src is provided", () => {
		const { container } = render(<Avatar />);
		expect(container.querySelector("svg")).toBeInTheDocument();
		expect(screen.queryByRole("img")).not.toBeInTheDocument();
	});

	it("applies the default lg size class", () => {
		const { container } = render(<Avatar />);
		expect(container.firstChild).toHaveClass("avatar--lg");
	});

	it("applies the specified size class", () => {
		const { container } = render(<Avatar size="sm" />);
		expect(container.firstChild).toHaveClass("avatar--sm");
	});

	it("applies no-src class when src is absent", () => {
		const { container } = render(<Avatar />);
		expect(container.firstChild).toHaveClass("avatar--no-src");
	});

	it("does not apply no-src class when src is provided", () => {
		const { container } = render(
			<Avatar src="https://example.com/avatar.jpg" />
		);
		expect(container.firstChild).not.toHaveClass("avatar--no-src");
	});
});

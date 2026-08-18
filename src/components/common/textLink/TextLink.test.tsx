import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TextLink } from "./TextLink";

const renderWithRouter = (ui: React.ReactElement) =>
	render(<MemoryRouter>{ui}</MemoryRouter>);

describe("TextLink", () => {
	it("renders the link text", () => {
		renderWithRouter(<TextLink text="Go to page" to="/page" />);
		expect(
			screen.getByRole("link", { name: "Go to page" })
		).toBeInTheDocument();
	});

	it("renders the correct href", () => {
		renderWithRouter(<TextLink text="Go to page" to="/page" />);
		expect(screen.getByRole("link")).toHaveAttribute("href", "/page");
	});
});

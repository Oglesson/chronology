import { render, screen } from "@testing-library/react";
import { NoResults } from "./NoResults";

describe("NoResults", () => {
	it("renders a no-results heading", () => {
		render(<NoResults />);
		expect(
			screen.getByText(/No results were found that match your search/)
		).toBeInTheDocument();
	});

	it("renders a suggestion to modify search criteria", () => {
		render(<NoResults />);
		expect(
			screen.getByText(/Try modifying your search criteria/)
		).toBeInTheDocument();
	});

	it("forwards extra props to the wrapper element", () => {
		render(<NoResults data-testid="no-results" />);
		expect(screen.getByTestId("no-results")).toBeInTheDocument();
	});
});

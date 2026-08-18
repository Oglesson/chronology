export const TestComponent = () => {
	return (
		<div>
			<input
				className="text-black"
				type="email"
				data-testid="email"
				data-email
			/>
			<button
				className="text-white"
				type="button"
				data-button
				onClick={() => {
					const email = document.querySelector<HTMLInputElement>("[data-email]");
					const message = document.querySelector<HTMLElement>("[data-message]");

					if (email?.value && message) {
						message.hidden = false;
					}
				}}
			>
				Submit your email
			</button>
			<p className="text-white" data-testid="message" data-message hidden>
				Thanks for submitting your email
			</p>
		</div>
	);
};

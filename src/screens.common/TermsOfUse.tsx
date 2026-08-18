import { useTranslation } from "react-i18next";

export const TermsOfUse = () => {
	const { t } = useTranslation();

	return (
		<div className="grid-container min-h-full flex flex-col pl-20 py-20 max-w-2xl">
			<h1 className="typo-large mb-10">{t("termsOfUse")}</h1>

			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				Last updated: January 1, 2025
			</p>

			<h2 className="typo-h3 mb-4">1. Acceptance of Terms</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				By accessing and using this platform, you accept and agree to be
				bound by the terms and provisions of this agreement. If you do not
				agree to abide by these terms, please do not use this service.
				These terms apply to all users of the platform.
			</p>

			<h2 className="typo-h3 mb-4">2. Use of the Service</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				You may use our service only for lawful purposes and in accordance
				with these terms. You agree not to use the service in any way that
				violates applicable laws or regulations, or to transmit any
				material that is harmful, offensive, or otherwise objectionable.
				You are responsible for maintaining the confidentiality of your
				account credentials.
			</p>

			<h2 className="typo-h3 mb-4">3. Intellectual Property</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				The service and its original content, features, and functionality
				are and will remain the exclusive property of the company and its
				licensors. Our trademarks and trade dress may not be used in
				connection with any product or service without the prior written
				consent of the company.
			</p>

			<h2 className="typo-h3 mb-4">4. User Content</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				You retain ownership of any content you submit, post, or display on
				or through the service. By submitting content, you grant us a
				worldwide, non-exclusive, royalty-free licence to use, reproduce,
				modify, and distribute such content solely for the purpose of
				operating and improving the service.
			</p>

			<h2 className="typo-h3 mb-4">5. Limitation of Liability</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				In no event shall the company, its directors, employees, partners,
				agents, suppliers, or affiliates be liable for any indirect,
				incidental, special, consequential, or punitive damages, including
				without limitation, loss of profits, data, use, goodwill, or other
				intangible losses, resulting from your access to or use of the
				service.
			</p>

			<h2 className="typo-h3 mb-4">6. Termination</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We may terminate or suspend your account and access to the service
				immediately, without prior notice or liability, for any reason,
				including if you breach these terms. Upon termination, your right
				to use the service will immediately cease. All provisions of these
				terms which by their nature should survive termination shall
				survive.
			</p>

			<h2 className="typo-h3 mb-4">7. Changes to Terms</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We reserve the right to modify or replace these terms at any time.
				If a revision is material, we will provide at least 30 days notice
				prior to any new terms taking effect. Your continued use of the
				service after any changes constitutes acceptance of the new terms.
			</p>

			<h2 className="typo-h3 mb-4">8. Contact Us</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				If you have any questions about these Terms of Use, please contact
				us at legal@example.com. We will endeavour to respond to all
				enquiries within a reasonable timeframe.
			</p>
		</div>
	);
};

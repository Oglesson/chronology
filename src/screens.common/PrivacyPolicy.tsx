import { useTranslation } from "react-i18next";

export const PrivacyPolicy = () => {
	const { t } = useTranslation();

	return (
		<div className="grid-container min-h-full flex flex-col pl-20 py-20 max-w-2xl">
			<h1 className="typo-large mb-10">{t("privacyPolicy")}</h1>

			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				Last updated: January 1, 2025
			</p>

			<h2 className="typo-h3 mb-4">1. Information We Collect</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We collect information you provide directly to us, such as when you
				create an account, use our services, or contact us for support.
				This may include your name, email address, and usage data. We also
				collect information automatically when you use our platform,
				including log data, device information, and cookies.
			</p>

			<h2 className="typo-h3 mb-4">2. How We Use Your Information</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We use the information we collect to provide, maintain, and improve
				our services, process transactions, send you technical notices and
				support messages, and respond to your comments and questions. We
				may also use your information to send promotional communications,
				but you may opt out of these at any time.
			</p>

			<h2 className="typo-h3 mb-4">3. Information Sharing</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We do not sell, trade, or otherwise transfer your personally
				identifiable information to outside parties except as described in
				this policy. We may share your information with trusted third
				parties who assist us in operating our platform, conducting our
				business, or servicing you, as long as those parties agree to keep
				this information confidential.
			</p>

			<h2 className="typo-h3 mb-4">4. Data Retention</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We retain your personal information for as long as necessary to
				fulfil the purposes described in this policy, unless a longer
				retention period is required or permitted by law. When we no longer
				need your information, we will securely delete or anonymise it.
			</p>

			<h2 className="typo-h3 mb-4">5. Security</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				We take reasonable measures to help protect your personal
				information from loss, theft, misuse, and unauthorised access,
				disclosure, alteration, and destruction. However, no security
				system is impenetrable and we cannot guarantee the security of our
				systems with absolute certainty.
			</p>

			<h2 className="typo-h3 mb-4">6. Your Rights</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				You have the right to access, update, or delete your personal
				information at any time. You may also have the right to restrict or
				object to certain processing of your data. To exercise these
				rights, please contact us using the details provided below.
			</p>

			<h2 className="typo-h3 mb-4">7. Contact Us</h2>
			<p className="typo-body mb-6 text-grey-mid dark:text-grey-light">
				If you have any questions about this Privacy Policy, please contact
				us at privacy@example.com. We will respond to your enquiry within a
				reasonable timeframe.
			</p>
		</div>
	);
};

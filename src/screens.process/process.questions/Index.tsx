import { AwaitLoaderData } from "../../components/common/loader/AwaitLoaderData";
import { QuestionGroupsMenu } from "./partials/_QuestionGroupsMenu";
import { QuestionsGroups } from "./partials/_QuestionsGroups";

export const Questions = () => (
	<AwaitLoaderData>
		<div className="grid grid-cols-12 gap-10">
			<div className="col-span-3">
				<QuestionGroupsMenu />
			</div>
			<div className="col-span-9 pb-10">
				<QuestionsGroups />
			</div>
		</div>
	</AwaitLoaderData>
);

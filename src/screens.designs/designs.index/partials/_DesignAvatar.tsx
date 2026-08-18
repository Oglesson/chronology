import { DesignData } from "../../../api.common/types";
import { Avatar } from "../../../components/common/avatar/Avatar";
import { useDesignFile } from "../../../hooks.queries/useDesignFile";

type DesignAvatarProps = {
	style: DesignData;
};

export const DesignAvatar = ({ style, ...props }: DesignAvatarProps) => {
	const { fileName, filePath } = useDesignFile(style.PhotoURL || "");
	return <Avatar src={filePath} altText={fileName} size="lg" {...props} />;
};

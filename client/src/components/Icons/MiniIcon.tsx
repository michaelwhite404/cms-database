import ColorIcon from "./FieldMiniIcons/ColorIcon";
import EmailIcon from "./FieldMiniIcons/EmailIcon";
import FileIcon from "./FieldMiniIcons/FileIcon";
import ImageIcon from "./FieldMiniIcons/ImageIcon";
import LinkIcon from "./FieldMiniIcons/LinkIcon";
import NumberIcon from "./FieldMiniIcons/NumberIcon";
import PhoneIcon from "./FieldMiniIcons/PhoneIcon";
import PlainTextIcon from "./FieldMiniIcons/PlainTextIcon";
import VideoIcon from "./FieldMiniIcons/VideoIcon";

const MiniIcon: { [x: string]: (props: React.ComponentProps<"svg">) => JSX.Element } = {};

MiniIcon.PlainText = PlainTextIcon;
// MiniIcon.RichText = RichTextButtonIcon;
MiniIcon.Image = ImageIcon;
MiniIcon.Video = VideoIcon;
MiniIcon.Link = LinkIcon;
MiniIcon.Email = EmailIcon;
MiniIcon.Phone = PhoneIcon;
MiniIcon.Number = NumberIcon;
MiniIcon.Color = ColorIcon;
MiniIcon.File = FileIcon;

export default MiniIcon;

import BoolIcon from "./FieldMiniIcons/BoolIcon";
import ColorIcon from "./FieldMiniIcons/ColorIcon";
import DateIcon from "./FieldMiniIcons/DateIcon";
import EmailIcon from "./FieldMiniIcons/EmailIcon";
import FileIcon from "./FieldMiniIcons/FileIcon";
import ImageIcon from "./FieldMiniIcons/ImageIcon";
import LinkIcon from "./FieldMiniIcons/LinkIcon";
import MultiReferenceIcon from "./FieldMiniIcons/MultiReferenceIcon";
import NumberIcon from "./FieldMiniIcons/NumberIcon";
import OptionIcon from "./FieldMiniIcons/OptionIcon";
import PhoneIcon from "./FieldMiniIcons/PhoneIcon";
import PlainTextIcon from "./FieldMiniIcons/PlainTextIcon";
import ReferenceIcon from "./FieldMiniIcons/ReferenceIcon";
import RichTextIcon from "./FieldMiniIcons/RichTextIcon";
import VideoIcon from "./FieldMiniIcons/VideoIcon";

const MiniIcon: { [x: string]: (props: React.ComponentProps<"svg">) => JSX.Element } = {};

MiniIcon.PlainText = PlainTextIcon;
MiniIcon.RichText = RichTextIcon;
MiniIcon.Image = ImageIcon;
MiniIcon.Video = VideoIcon;
MiniIcon.Link = LinkIcon;
MiniIcon.Email = EmailIcon;
MiniIcon.Phone = PhoneIcon;
MiniIcon.Number = NumberIcon;
MiniIcon.Date = DateIcon;
MiniIcon.Bool = BoolIcon;
MiniIcon.Color = ColorIcon;
MiniIcon.File = FileIcon;
MiniIcon.Option = OptionIcon;
MiniIcon.Reference = ReferenceIcon;
MiniIcon.MultiReference = MultiReferenceIcon;

export default MiniIcon;

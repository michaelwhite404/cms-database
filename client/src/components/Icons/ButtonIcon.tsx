import React from "react";
import PlainTextButtonIcon from "./Buttons/PlainTextButtonIcon";
import RichTextButtonIcon from "./Buttons/RichTextButtonIcon";
import ImageButtonIcon from "./Buttons/ImageButtonIcon";
import VideoButtonIcon from "./Buttons/VideoButtonIcon";
import LinkButtonIcon from "./Buttons/LinkButtonIcon";
import EmailButtonIcon from "./Buttons/EmailButtonIcon";
import PhoneButtonIcon from "./Buttons/PhoneButtonIcon";
import NumberButtonIcon from "./Buttons/NumberButtonIcon";
import DateButtonIcon from "./Buttons/DateButtonIcon";
import BoolButtonIcon from "./Buttons/BoolButtonIcon";
import ColorButtonIcon from "./Buttons/ColorButtonIcon";
import OptionButtonIcon from "./Buttons/OptionButtonIcon";
import FileButtonIcon from "./Buttons/FileButtonIcon";
import ReferenceButtonIcon from "./Buttons/ReferenceButtonIcon";
import MultiReferenceButtonIcon from "./Buttons/MultiReferenceButtonIcon";

const ButtonIcon: { [x: string]: (props: React.ComponentProps<"svg">) => JSX.Element } = {};

ButtonIcon.PlainText = PlainTextButtonIcon;
ButtonIcon.RichText = RichTextButtonIcon;
ButtonIcon.Image = ImageButtonIcon;
ButtonIcon.Video = VideoButtonIcon;
ButtonIcon.Link = LinkButtonIcon;
ButtonIcon.Email = EmailButtonIcon;
ButtonIcon.Phone = PhoneButtonIcon;
ButtonIcon.Number = NumberButtonIcon;
ButtonIcon.Date = DateButtonIcon;
ButtonIcon.Bool = BoolButtonIcon;
ButtonIcon.Color = ColorButtonIcon;
ButtonIcon.Option = OptionButtonIcon;
ButtonIcon.File = FileButtonIcon;
ButtonIcon.Reference = ReferenceButtonIcon;
ButtonIcon.MultiReference = MultiReferenceButtonIcon;

export default ButtonIcon;

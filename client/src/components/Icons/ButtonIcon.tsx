import React from "react";
import ImageButtonIcon from "./Buttons/ImageButtonIcon";
import LinkButtonIcon from "./Buttons/LinkButtonIcon";
import PlainTextButtonIcon from "./Buttons/PlainTextButtonIcon";
import RichTextButtonIcon from "./Buttons/RichTextButtonIcon";
import VideoButtonIcon from "./Buttons/VideoButtonIcon";

const ButtonIcon: { [x: string]: (props: React.ComponentProps<"svg">) => JSX.Element } = {};

ButtonIcon.PlainText = PlainTextButtonIcon;
ButtonIcon.RichText = RichTextButtonIcon;
ButtonIcon.Image = ImageButtonIcon;
ButtonIcon.Video = VideoButtonIcon;
ButtonIcon.Link = LinkButtonIcon;

export default ButtonIcon;

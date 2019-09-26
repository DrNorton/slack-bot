import TopItemDto from "../../../../api/requests/topItemDto";
import { Avatar } from "@material-ui/core";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import DefaultAvatar from "../../../../assets/images/default-avatar.png";

interface WinnerProps {
  score?: TopItemDto;
  className: string;
}

export default function WinnerAvatar(props: WinnerProps) {
  let avatar;
  if (props.score && props.score.winner && props.score.winner.avatarUrl) {
    avatar = props.score.winner.avatarUrl;
  } else {
    avatar = DefaultAvatar;
  }
  return <Avatar alt="Person" className={props.className} src={avatar} />;
}

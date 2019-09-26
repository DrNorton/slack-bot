import { Avatar } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import React from "react";
import { UserDto } from "../../api/requests/user.dto";

interface Props {
  profile: UserDto;
  className: string;
}

export default function ProfileAvatar(props: Props) {
  let avatar;
  if (props.profile.avatarUrl) {
    avatar = props.profile.avatarUrl;
  } else {
    avatar = DefaultAvatar;
  }
  return (
    <Avatar
      alt="Person"
      className={props.className}
      component={RouterLink}
      src={avatar}
      to="/settings"
    />
  );
}

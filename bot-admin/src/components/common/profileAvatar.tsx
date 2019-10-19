import { Avatar } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { IUserDto } from '../../api/requests/user.dto';
import DefaultAvatar from '../../assets/images/default-avatar.png';

interface IProps {
    profile: IUserDto;
    className: string;
}

export default function ProfileAvatar(props: IProps): JSX.Element {
    let avatar;
    if (props.profile.avatarUrl) {
        avatar = props.profile.avatarUrl;
    } else {
        avatar = DefaultAvatar;
    }
    return <Avatar alt="Person" className={props.className} component={RouterLink} src={avatar} to="/settings" />;
}

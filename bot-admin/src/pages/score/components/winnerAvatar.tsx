import { Avatar } from '@material-ui/core';
import * as React from 'react';

import { ITopItemDto } from '../../../api/requests/topItemDto';
import DefaultAvatar from '../../../assets/images/default-avatar.png';

interface IWinnerProps {
    score?: ITopItemDto;
    className: string;
}

export default function WinnerAvatar (props: IWinnerProps): JSX.Element {
    let avatar;
    if (props.score && props.score.winner && props.score.winner.avatarUrl) {
        avatar = props.score.winner.avatarUrl;
    } else {
        avatar = DefaultAvatar;
    }
    return <Avatar alt="Person" className={props.className} src={avatar} />;
}

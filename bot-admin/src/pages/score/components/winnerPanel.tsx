import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';

import { ITopItemDto } from '../../../api/requests/topItemDto';
import WinnerAvatar from './winnerAvatar';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatarWithScoreTop: {
            display: 'flex',
            flexDirection: 'row',
        },
        panel: {
            marginRight: theme.spacing(1),
        },
        winnerAvatarPaper: {
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '400px',
            height: '400px',
        },
        typographyWhite: {
            color: 'white',
            margin: theme.spacing(1),
        },
        avatar: {
            marginTop: theme.spacing(1),
            width: 200,
            height: 200,
        },
    }),
);

interface IProps {
    winner?: ITopItemDto;
}

export default function WinnerPanel (props: IProps): JSX.Element {
    const classes = useStyles();
    const { winner } = props;
    return (
        <div className={classes.avatarWithScoreTop}>
            <div className={classes.panel}>
                <div className={classes.winnerAvatarPaper}>
                    {winner ? (
                        <>
                            <Typography className={classes.typographyWhite} variant="h3">
                                Победитель недели
                            </Typography>
                            <WinnerAvatar className={classes.avatar} score={winner} />
                            <Typography className={classes.typographyWhite} variant="h3">
                                {winner.score}
                            </Typography>
                        </>
                    ) : (
                        <Typography className={classes.typographyWhite} variant="h3">
                            Нет данных
                        </Typography>
                    )}
                </div>
            </div>
        </div>
    );
}

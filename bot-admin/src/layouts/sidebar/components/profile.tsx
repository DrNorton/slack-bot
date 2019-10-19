import { createStyles, Theme, Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { IUserDto } from '../../../api/requests/user.dto';
import ProfileAvatar from '../../../components/common/profileAvatar';
import { IReduxState } from '../../../reduxx/reducer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'fit-content',
        },
        avatar: {
            width: 60,
            height: 60,
        },
        name: {
            marginTop: theme.spacing(1),
        },
    }),
);

interface IProps extends IStatedProps {
    className: any;
}

interface IStatedProps {
    profile: IUserDto;
}

function Profile (props: IProps): JSX.Element {
    const { className, profile } = props;

    const classes = useStyles();

    if (profile) {
        return (
            <div className={clsx(classes.root, className)}>
                <ProfileAvatar profile={profile} className={classes.avatar} />

                <Typography className={classes.name} variant="h4">
                    {profile.name}
                </Typography>
                <Typography variant="body2">{profile.teamName}</Typography>
            </div>
        );
    } else {
        return (
            <div className={clsx(classes.root, className)}>
                <Skeleton className={classes.avatar} variant="circle" />
                <Skeleton className={classes.name} width="60%" height={20} />
                <Skeleton className={classes.name} width="40%" height={12} />
            </div>
        );
    }
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    profile: state.auth.getIn(['userProfile', 'data']) as IUserDto,
});

export default connect(mapStateToProps)(Profile);

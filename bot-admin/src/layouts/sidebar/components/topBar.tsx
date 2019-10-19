import { AppBar, Badge, createStyles, Hidden, IconButton, Theme, Toolbar } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, RouteComponentProps, withRouter } from 'react-router-dom';

import { logout } from '../../../ducks/auth';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            boxShadow: 'none',
        },
        flexGrow: {
            flexGrow: 1,
        },
        signOutButton: {
            marginLeft: theme.spacing(1),
        },
    }),
);

interface IDispatchedProps {
    logout: () => void;
}

interface IProps extends IDispatchedProps, RouteComponentProps {
    onSidebarOpen: () => void;
}

function Topbar(props: IProps): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onSidebarOpen, staticContext, logout: logoutMethod, history, ...rest } = props;

    const classes = useStyles();

    const signoutHandlerClick = () => {
        logoutMethod();
        history.push('/login');
    };

    const [notifications] = useState([]);

    return (
        <AppBar {...rest} className={classes.root}>
            <Toolbar>
                <RouterLink to="/">
                    <img alt="Logo" src="https://react-material-dashboard.devias.io/images/logos/logo--white.svg" />
                </RouterLink>
                <div className={classes.flexGrow} />
                <Hidden mdDown>
                    <IconButton color="inherit">
                        <Badge badgeContent={notifications.length} color="primary" variant="dot">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton onClick={signoutHandlerClick} className={classes.signOutButton} color="inherit">
                        <InputIcon />
                    </IconButton>
                </Hidden>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onSidebarOpen}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
}

export default connect(
    null,
    {
        logout,
    },
)(withRouter(Topbar));

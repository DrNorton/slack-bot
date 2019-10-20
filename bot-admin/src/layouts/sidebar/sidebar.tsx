import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Profile from './components/profile';
import SidebarNav from './components/sidebarNav';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: 240,
            [theme.breakpoints.up('lg')]: {
                marginTop: 64,
                height: 'calc(100% - 64px)',
            },
        },
        root: {
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: theme.spacing(2),
        },
        divider: {
            margin: theme.spacing(2, 0),
        },
        nav: {
            marginBottom: theme.spacing(2),
        },
    }),
);

interface IProps extends RouteComponentProps {
    variant: string;
    open: boolean;
    onClose: () => void;
}

export interface ISidebarMenuItem {
    icon?: any;
    title: string;
    href: string;
    children?: ISidebarMenuItem[];
}

export interface ISidebarPageBlock {
    title: string;
    pages: ISidebarMenuItem[];
}

function Sidebar (props: IProps): JSX.Element {
    const classes = useStyles();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { open, variant, onClose, staticContext, ...rest } = props;

    return (
        <Drawer variant="persistent" classes={{ paper: classes.drawer }} open={props.open}>
            <div {...rest} className={classes.root}>
                <Profile />
                <Divider className={classes.divider} />
                <SidebarNav className={classes.nav} />
            </div>
        </Drawer>
    );
}

export default withRouter(Sidebar);

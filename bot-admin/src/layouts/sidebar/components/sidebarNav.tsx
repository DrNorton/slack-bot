import { colors, createStyles, Theme } from '@material-ui/core';
import { DashboardOutlined, MeetingRoomOutlined, QuestionAnswerOutlined, ScoreOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import Navigation from '../../../components/navigation/navigation';
import { ISidebarPageBlock } from '../sidebar';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        item: {
            display: 'flex',
            paddingTop: 0,
            paddingBottom: 0,
        },
        button: {
            color: colors.blueGrey[800],
            padding: '10px 8px',
            justifyContent: 'flex-start',
            textTransform: 'none',
            letterSpacing: 0,
            width: '100%',
            fontWeight: theme.typography.fontWeightMedium,
        },
        icon: {
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            marginRight: theme.spacing(1),
        },
        active: {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
            '& $icon': {
                color: theme.palette.primary.main,
            },
        },
        navigation: {
            marginTop: theme.spacing(2),
        },
    }),
);

// const CustomRouterLink = forwardRef((props: any, ref) => (
//     <div style={{ flexGrow: 1 }}>
//         <RouterLink exact={true} to={props.href} activeClassName={props.activeClassName} {...props} />
//     </div>
// ));

interface ISidebarNavProps {
    className: any;
}

const menu: ISidebarPageBlock[] = [
    {
        title: 'Pages',
        pages: [
            {
                title: 'Главная',
                icon: DashboardOutlined,
                href: '/',
            },
            {
                title: 'Вопросы и ответы',
                icon: QuestionAnswerOutlined,
                href: '/faq',
            },
            {
                title: 'Счёт',
                icon: ScoreOutlined,
                href: '/score',
            },
            {
                title: 'Бронирование',
                icon: MeetingRoomOutlined,
                href: '/booking',
                children: [
                    { title: 'Расписание', href: '/booking/schedule' },
                    { title: 'Комнаты', href: '/booking/rooms' },
                    { title: 'Настройки', href: '/booking/settings' },
                ],
            },
        ],
    },
];

function SidebarNav (props: ISidebarNavProps): JSX.Element {
    const { className, ...rest } = props;

    const classes = useStyles();

    return (
        <nav className={classes.navigation}>
            {menu.map(list => (
                <Navigation {...rest} component="div" key={list.title} pages={list.pages} title={list.title} />
            ))}
        </nav>
    );
}

export default SidebarNav;

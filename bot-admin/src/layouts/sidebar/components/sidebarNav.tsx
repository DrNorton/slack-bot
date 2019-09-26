/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  List,
  ListItem,
  Button,
  colors,
  Theme,
  createStyles
} from "@material-ui/core";
import { SidebarMenuItem } from "../sidebar";
import {Dashboard, QuestionAnswer, Score} from "@material-ui/icons";
import requireAuth from "../../../decorators/requireAuth";
import MainPage from "../../../components/pages/main/mainPage";
import faqListPage from "../../../components/pages/faq/faqListPage";
import addFaqItemPage from "../../../components/pages/faq/addFaqItemPage";
import enterPage from "../../../components/pages/auth/enterPage";
import loginPage from "../../../components/pages/auth/loginPage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {
      display: "flex",
      paddingTop: 0,
      paddingBottom: 0
    },
    button: {
      color: colors.blueGrey[800],
      padding: "10px 8px",
      justifyContent: "flex-start",
      textTransform: "none",
      letterSpacing: 0,
      width: "100%",
      fontWeight: theme.typography.fontWeightMedium
    },
    icon: {
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      marginRight: theme.spacing(1)
    },
    active: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
      "& $icon": {
        color: theme.palette.primary.main
      }
    }
  })
);

const CustomRouterLink = forwardRef((props:any, ref) => (
  <div  style={{ flexGrow: 1 }}>
    <RouterLink exact={true}  to={props.href} activeClassName={props.activeClassName} {...props} />
  </div>
));

interface SidebarNavProps {
  className:any;
}
const menu: SidebarMenuItem[] = [
    {
        title: "Главная",
        icon: <Dashboard />,
        route:"/",
    },
    {
        title: "Вопросы и ответы",
        icon: <QuestionAnswer/>,
        route: "/faq"
    },
    {
        title: "Счёт",
        icon: <Score/>,
        route: "/score"
    }
];

function SidebarNav(props: SidebarNavProps) {
  const { className, ...rest } = props;

  const classes = useStyles();


  return (
    <List {...rest} className={clsx(classes.root, className)}>
      {menu.map(page => (
        <ListItem className={classes.item} disableGutters key={page.title}>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            href={page.route}
          >
            <div className={classes.icon}>{page.icon}</div>
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
}

export default SidebarNav;

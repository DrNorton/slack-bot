import React, { useState } from "react";
import { Link as RouterLink, RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import {
  AppBar,
  Toolbar,
  Badge,
  Hidden,
  IconButton,
  createStyles,
  Theme
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import InputIcon from "@material-ui/icons/Input";
import { connect } from "react-redux";
import {  logout } from "../../../ducks/auth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: "none"
    },
    flexGrow: {
      flexGrow: 1
    },
    signOutButton: {
      marginLeft: theme.spacing(1)
    }
  })
);

interface DispatchedProps {
  logout: () => void;
}

interface Props extends DispatchedProps, RouteComponentProps {
  onSidebarOpen: () => void;
}

function Topbar(props: Props) {
  const { onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const signoutHandlerClick = () => {
    props.logout();
    props.history.push("/login");
  };

  const [notifications] = useState([]);

  return (
    <AppBar {...rest} className={classes.root}>
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="https://react-material-dashboard.devias.io/images/logos/logo--white.svg"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            onClick={signoutHandlerClick}
            className={classes.signOutButton}
            color="inherit"
          >
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
    logout
  }
)(withRouter(Topbar));

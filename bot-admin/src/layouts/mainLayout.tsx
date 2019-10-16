import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

import Sidebar from "./sidebar/sidebar";
import Topbar from "./sidebar/components/topBar";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: 56,
    padding: theme.spacing(3),
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: "100%",
    padding: theme.spacing(3)
  }
}));
interface Props {
  children?: React.ReactNode;
  title: string;
}
function MainLayout(props: Props) {
  const { children, title } = props;
  const classes = useStyles();
  const isDesktop = true;

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? "persistent" : "temporary"}
      />
      <main className={classes.content}>{children}</main>
    </div>
  );
}

export default MainLayout;

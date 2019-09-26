import React from "react";
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles(() => ({
  content: {
    height: "100%",
    width: "100%"
  }
}));

const MinimalLayout = props => {
  const { children } = props;

  const classes = useStyles();

  return <main className={classes.content}>{children}</main>;
};
export default MinimalLayout;

import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    colorPreview: {
      height: "30px",
      width: "30px",
      borderRadius: "4px"
    }
  })
);

interface Props {
  color: string;
}

export default function ColorView(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.colorPreview} style={{ background: props.color }} />
  );
}

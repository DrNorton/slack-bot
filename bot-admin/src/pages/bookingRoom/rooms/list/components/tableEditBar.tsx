import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  Drawer,
  Grid,
  Typography,
  Button,
  Hidden,
  createStyles,
  Theme
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    },
    actions: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      "& > * + *": {
        marginLeft: theme.spacing(2)
      }
    },
    buttonIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

interface Props {
  className?: string;
  onDelete: () => void;
  selected: number[];
}

const TableEditBar = (props: Props) => {
  const { selected, className, onDelete, ...rest } = props;

  const classes = useStyles();
  const open = selected.length > 0;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      // eslint-disable-next-line react/jsx-sort-props
      PaperProps={{ elevation: 1 }}
      variant="persistent"
    >
      <div {...rest} className={clsx(classes.root, className)}>
        <Grid alignItems="center" container spacing={2}>
          <Hidden smDown>
            <Grid item md={3}>
              <Typography color="textSecondary" variant="subtitle1">
                {selected.length} selected
              </Typography>
            </Grid>
          </Hidden>
          <Grid item md={6} xs={12}>
            <div className={classes.actions}>
              <Button onClick={onDelete}>
                <DeleteIcon className={classes.buttonIcon} />
                Delete
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
};

export default TableEditBar;

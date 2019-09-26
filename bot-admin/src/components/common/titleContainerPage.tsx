import * as React from "react";
import {
  createStyles,
  Divider,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: { margin: 10 },
    divider: {
      marginTop: 5,
      marginBottom: 5
    }
  })
);

const TitleContainerPage: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  return (
    <div>
      {props.title && (
        <Typography className={classes.header} variant="h3">
          {props.title}
        </Typography>
      )}
      <Divider className={classes.divider} />
      {props.children}
    </div>
  );
};

export default TitleContainerPage;

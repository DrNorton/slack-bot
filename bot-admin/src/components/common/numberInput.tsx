import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Add, Remove } from "@material-ui/icons";
import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import clsx from "clsx";
interface Props {
  onChange: (value: number) => void;
  value: number;
  className: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {},
    panel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    }
  })
);

const NumberInput: React.FunctionComponent<Props> = props => {
  const styles = useStyles();
  function up() {
    props.onChange(props.value + 1);
  }
  function down() {
    props.onChange(props.value - 1);
  }
  return (
    <div className={clsx(props.className, styles.panel)}>
      <IconButton className={styles.button} onClick={down}>
        <Remove />
      </IconButton>
      <Typography variant="h4">{props.value}</Typography>
      <IconButton className={styles.button} onClick={up}>
        <Add />
      </IconButton>
    </div>
  );
};

export default NumberInput;

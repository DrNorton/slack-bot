import React from "react";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import TwitterPicker from "react-color/lib/components/twitter/Twitter";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import { hexToRgbString } from "../../../../../utils/colorUtils";
import ColorView from "./colorViewer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      marginTop: "10px"
    },
    paper: {
      marginRight: theme.spacing(2)
    },
    iconButton: {
      padding: 0,
      marginTop: "5px"
    }
  })
);

interface Props {
  onColorChange: (hex: string) => void;
  color: string;
}
export default function ColorPicker(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleChange = (color: string) => {
    props.onColorChange(color);
    setOpen(false);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);
  return (
    <div className={classes.root}>
      <InputLabel shrink={true} className="formControl">
        Цвет
      </InputLabel>

      <div>
        <IconButton
          ref={anchorRef}
          aria-controls="menu-list-grow"
          aria-haspopup="true"
          className={classes.iconButton}
          onClick={handleToggle}
        >
          <ColorView color={props.color} />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          keepMounted
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper id="menu-list-grow">
                <TwitterPicker
                  color="#ff00fb"
                  onChange={e => handleChange(e.hex)}
                />
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

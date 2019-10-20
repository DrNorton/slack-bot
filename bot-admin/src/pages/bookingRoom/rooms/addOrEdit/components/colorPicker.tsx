import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import TwitterPicker from 'react-color/lib/components/twitter/Twitter';

import ColorView from './colorViewer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '10px',
        },
        paper: {
            marginRight: theme.spacing(2),
        },
        iconButton: {
            padding: 0,
            marginTop: '5px',
        },
    }),
);

interface IProps {
    onColorChange: (hex: string) => void;
    color: string;
}

export default function ColorPicker (props: IProps): JSX.Element {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen(prevOpenState => !prevOpenState);
    };

    const handleChange = (color: string) => {
        props.onColorChange(color);
        setOpen(false);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>): void => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown (event: React.KeyboardEvent): void {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current && !open) {
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
                <IconButton ref={anchorRef} aria-controls="menu-list-grow" aria-haspopup="true" className={classes.iconButton} onClick={handleToggle}>
                    <ColorView color={props.color} />
                </IconButton>
                <Popper open={open} anchorEl={anchorRef.current} keepMounted transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper id="menu-list-grow">
                                <TwitterPicker color="#ff00fb" onChange={e => handleChange(e.hex)} />
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

export interface IDialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

export interface IProps {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
    saveClickHandler?: () => void;
    isOpen: boolean;
    saveButtonDisabled: boolean;
    fullscreen?: boolean;
}

const DialogTitle = withStyles(styles)((props: IDialogTitleProps) => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose && (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            )}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function PopupDialog (props: IProps): JSX.Element {
    const handleClose = () => {
        props.onClose();
    };

    const handleClickHandler = () => {
        props.onClose();
        if (props.saveClickHandler) {
            props.saveClickHandler();
        }
    };

    return (
        <Dialog
            fullWidth={true}
            fullScreen={props.fullscreen}
            maxWidth="md"
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.isOpen}
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {props.title}
            </DialogTitle>
            <DialogContent dividers>{props.children}</DialogContent>
            <DialogActions>
                {props.saveClickHandler && (
                    <Button disabled={props.saveButtonDisabled} variant="contained" onClick={handleClickHandler} color="primary">
                        Сохранить
                    </Button>
                )}
                <Button onClick={handleClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
}

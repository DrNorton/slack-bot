import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EmojiPicker from 'emoji-picker-react';
import React from 'react';

import '../../../../variables/emoji.scss';

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

const DialogTitle = withStyles(styles)((props: IDialogTitleProps) => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
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

interface INewEmojiPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onEmojiPick: (emoji: string) => void;
}

export default function NewEmojiPicker (props: INewEmojiPickerProps): JSX.Element {
    const handleClose = () => {
        props.onClose();
    };

    const onSelectEmoji = (emoji: string, data: any) => {
        props.onEmojiPick(data.name);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={props.isOpen}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Modal title
            </DialogTitle>
            <DialogContent dividers>
                <EmojiPicker onEmojiClick={onSelectEmoji} disableDiversityPicker={true} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

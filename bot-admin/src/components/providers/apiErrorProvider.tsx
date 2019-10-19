import { IconButton, Snackbar, Theme } from '@material-ui/core';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import * as React from 'react';
import { connect } from 'react-redux';

import { ApiError } from '../../models/apiError';
import { IReduxState } from '../../reduxx/reducer';

interface IProps extends IStatedProps {
    children?: React.ReactNode;
}

interface IStatedProps {
    error: ApiError;
}

const useStyles = makeStyles((theme: Theme) => ({
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));

export interface ISnackbarContentWrapperProps {
    message?: string;
    onClose?: () => void;
}

const SnackbarContentWrapper = (props: ISnackbarContentWrapperProps): JSX.Element => {
    const classes = useStyles();
    const { message, onClose } = props;
    return (
        <SnackbarContent
            className={classes.error}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>}
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
        />
    );
};

export interface IApiErrorProviderState {
    open: boolean;
}

export class ApiErrorProvider extends React.Component<IProps, IApiErrorProviderState> {
    constructor (props: IProps) {
        super(props);
        this.state = { open: props.error.message !== undefined };
    }

    public componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IApiErrorProviderState>, snapshot?: any): void {
        if (prevProps.error !== this.props.error) {
            this.setState({ open: this.props.error.message !== undefined });
        }
    }

    public render (): JSX.Element {
        return (
            <>
                {this.props.children}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.open}
                    autoHideDuration={2000}
                >
                    <SnackbarContentWrapper onClose={this.handleClose} message={this.props.error.message} />
                </Snackbar>
            </>
        );
    }

    private handleClose = () => {
        this.setState({ open: false });
    };
}

const mapStateToProps = (state: IReduxState): IStatedProps => ({
    error: state.error,
});

export default connect(mapStateToProps)(ApiErrorProvider);

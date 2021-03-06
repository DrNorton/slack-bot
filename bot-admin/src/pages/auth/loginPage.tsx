import { Button, createStyles, Paper, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { IUserDto } from '../../api/requests/user.dto';
import SlackImage from '../../assets/images/sign_in_with_slack.png';
import BackgroundImage from '../../assets/images/slack-background.jpg';
import ProfileAvatar from '../../components/common/profileAvatar';
import Spinner from '../../components/common/spinner';
import { checkTokenAndGetProfile, ICheckTokenPayload } from '../../ducks/auth';
import { IReduxState } from '../../reduxx/reducer';

const styles = (theme: Theme) =>
    createStyles({
        main: {
            backgroundSize: '100% 100%',
            background: ` linear-gradient(
          rgba(0, 0, 0, 0.6),
          rgba(0, 0, 0, 0.6)
        ), url(${BackgroundImage})`,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '400px',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '20px',
        },
        slackButton: {
            backgroundImage: `url(${SlackImage})`,
            backgroundSize: '172px 40px',
            width: '172px',
            height: '40px',
            margin: '10px',
            backgroundPosition: 'center',
        },
        avatar: {
            marginTop: theme.spacing(1),
            width: 200,
            height: 200,
        },
        name: {
            marginTop: theme.spacing(1),
        },
        title: {
            marginTop: theme.spacing(4),
        },
    });

interface IInputPropsLocation {
    token: string;
}

interface IStatedProps {
    userProfileFetching: boolean;
    userProfile: IUserDto;
}

interface IDispatchedProps {
    getUserProfile: (payload: ICheckTokenPayload) => void;
}

interface IProps extends IStatedProps, IDispatchedProps, RouteComponentProps<IInputPropsLocation> {}

interface IState {
    token?: string;
}

class LoginPage extends React.Component<IProps & WithStyles<typeof styles>, IState> {
    constructor (props: IProps & WithStyles<typeof styles>) {
        super(props);
        const token = this.props.match.params.token;
        this.state = { token };
    }

    public componentDidMount (): void {
        if (this.state.token) {
            this.props.getUserProfile({ token: this.state.token, delay: 2000 });
        }
    }

    public componentDidUpdate (prevProps: Readonly<IProps & WithStyles<typeof styles>>, prevState: Readonly<IState>, snapshot?: any): void {
        if (!prevProps.userProfile && this.props.userProfile) {
            setTimeout(() => this.navigateToMain(), 1500);
        }
    }

    public render (): JSX.Element {
        let content;
        const { classes } = this.props;
        if (this.state.token) {
            // редирект после авторизации
            if (this.props.userProfileFetching || !this.props.userProfile) {
                content = (
                    <>
                        <Spinner isLoading={true} />{' '}
                        <Typography className={classes.title} variant="h3">
                            Вход ...
                        </Typography>
                    </>
                );
            } else {
                content = (
                    <>
                        <Typography variant="h3">Привет!</Typography>
                        <ProfileAvatar profile={this.props.userProfile} className={classes.avatar} />

                        <Typography className={classes.name} variant="h4">
                            {this.props.userProfile.name}
                        </Typography>
                        <Typography variant="body2">{this.props.userProfile.realName}</Typography>
                    </>
                );
            }
        } else {
            // первичный вход
            const installUrl = `${process.env.REACT_APP_SERVER_URL}/install`;
            content = (
                <>
                    <Typography variant="h3">Для входа нажмите на кнопку</Typography>
                    <Button href={installUrl} className={classes.slackButton} />
                </>
            );
        }

        return (
            <div className={classes.main}>
                <Paper className={classes.content}>{content}</Paper>
            </div>
        );
    }

    private navigateToMain = () => {
        this.props.history.push('/');
    };
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    userProfile: state.auth.getIn(['userProfile', 'data']) as IUserDto,
    userProfileFetching: state.auth.getIn(['userProfile', 'isFetching']) as boolean,
});

export default connect(
    mapStateToProps,
    {
        getUserProfile: checkTokenAndGetProfile.started,
    },
)(withStyles(styles)(LoginPage));

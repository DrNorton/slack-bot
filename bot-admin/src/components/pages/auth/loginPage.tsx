import * as React from "react";
import {
  Button,
  createStyles,
  Paper,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import BackgroundImage from "../../../assets/images/slack-background.jpg";
import SlackImage from "../../../assets/images/sign_in_with_slack.png";
import { RouteComponentProps } from "react-router";
import Spinner from "../../common/spinner";
import { ReduxState } from "../../../reduxx/reducer";
import { UserDto } from "../../../api/requests/user.dto";
import { connect } from "react-redux";
import {
  CheckTokenPayload,
  checkTokenAndGetProfile
} from "../../../ducks/auth";
import ProfileAvatar from "../../common/profileAvatar";

const styles = (theme: Theme) =>
  createStyles({
    main: {
      backgroundSize: "100% 100%",
      background: ` linear-gradient(
          rgba(0, 0, 0, 0.6), 
          rgba(0, 0, 0, 0.6)
        ), url(${BackgroundImage})`,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    content: {
      width: "400px",
      height: "400px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      background: "rgba(255,255,255,0.9)",
      borderRadius: "20px"
    },
    slackButton: {
      backgroundImage: `url(${SlackImage})`,
      backgroundSize: "172px 40px",
      width: "172px",
      height: "40px",
      margin: "10px",
      backgroundPosition: "center"
    },
    avatar: {
      marginTop: theme.spacing(1),
      width: 200,
      height: 200
    },
    name: {
      marginTop: theme.spacing(1)
    },
    title: {
      marginTop: theme.spacing(4)
    }
  });

interface InputPropsLocation {
  token: string;
}

interface StatedProps {
  userProfileFetching: boolean;
  userProfile: UserDto;
}

interface DispatchedProps {
  getUserProfile: (payload: CheckTokenPayload) => void;
}

interface Props
  extends StatedProps,
    DispatchedProps,
    RouteComponentProps<InputPropsLocation> {}

interface State {
  token?: string;
}

class LoginPage extends React.Component<
  Props & WithStyles<typeof styles>,
  State
> {
  constructor(props: Props & WithStyles<typeof styles>) {
    super(props);
    const token = this.props.match.params.token;
    this.state = { token };
  }

  public componentDidMount(): void {
    if (this.state.token) {
      this.props.getUserProfile({ token: this.state.token, delay: 2000 });
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Props & WithStyles<typeof styles>>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (!prevProps.userProfile && this.props.userProfile) {
      setTimeout(() => this.navigateToMain(), 1500);
    }
  }

  public render() {
    let content;
    const { classes } = this.props;
    if (this.state.token) {
      // редирект после авторизации
      if (this.props.userProfileFetching || !this.props.userProfile) {
        content = (
          <>
            <Spinner isLoading={true} />{" "}
            <Typography className={classes.title} variant="h3">
              Вход ...
            </Typography>
          </>
        );
      } else {
        content = (
          <>
            <Typography variant="h3">Привет!</Typography>
            <ProfileAvatar
              profile={this.props.userProfile}
              className={classes.avatar}
            />

            <Typography className={classes.name} variant="h4">
              {this.props.userProfile.name}
            </Typography>
            <Typography variant="body2">
              {this.props.userProfile.realName}
            </Typography>
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
    this.props.history.push("/");
  };
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  userProfile: state.auth.getIn(["userProfile", "data"]) as UserDto,
  userProfileFetching: state.auth.getIn([
    "userProfile",
    "isFetching"
  ]) as boolean
});

export default connect(
  mapStateToProps,
  {
    getUserProfile: checkTokenAndGetProfile.started
  }
)(withStyles(styles)(LoginPage));

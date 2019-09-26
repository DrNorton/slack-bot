import { RouteComponentProps, withRouter } from "react-router";
import * as React from "react";
import { ReduxState } from "../../../reduxx/reducer";
import { connect } from "react-redux";
import { checkTokenAndGetProfile, CheckTokenPayload } from "../../../ducks/auth";
import {UserDto} from "../../../api/requests/user.dto";

interface InputPropsLocation {
  token: string;
}

interface State {
  token: string;
}

interface StatedProps {
  tokenCheckFetching: boolean;
  userProfile: UserDto;
}

interface DispatchedProps {
  getUserProfile: (payload: CheckTokenPayload) => void;
}

interface Props
  extends StatedProps,
    DispatchedProps,
    RouteComponentProps<InputPropsLocation> {}

class EnterPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const token = this.props.match.params.token;
    this.state = { token };
  }

  public componentDidMount(): void {
    this.props.getUserProfile({ token: this.state.token });
  }

  public render() {
    if(this.props.userProfile){
      return <div>{this.props.userProfile.realName}</div>;
    }
    else{
      return <div>{"TEST"}</div>;
    }

  }
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  userProfile: state.auth.getIn(["userProfile", "data"]) as UserDto,
  tokenCheckFetching: state.auth.getIn([
    "userProfile",
    "isFetching"
  ]) as boolean
});

export default connect(
  mapStateToProps,
  {
    getUserProfile: checkTokenAndGetProfile.started
  }
)(withRouter(EnterPage));

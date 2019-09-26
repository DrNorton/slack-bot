import { ReduxState } from "../../reduxx/reducer";
import { connect } from "react-redux";
import React from "react";
import { isAuth, getProfile } from "../../ducks/auth";
import { UserDto } from "../../api/requests/user.dto";

interface Props extends StatedProps, DispatchedProps {
  children: React.ReactNode;
}

interface DispatchedProps {
  getUserProfile: () => void;
}

interface StatedProps {
  isAuth: boolean;
  profile: UserDto;
}

class InitRequestsProvider extends React.Component<Props> {
  public componentDidMount(): void {
    if (this.props.isAuth && !this.props.profile) {
      this.props.getUserProfile();
    }
  }

  public render() {
    return this.props.children;
  }
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  isAuth: isAuth(state),
  profile: state.auth.getIn(["userProfile", "data"]) as UserDto
});

export default connect(
  mapStateToProps,
  {
    getUserProfile: getProfile.started
  }
)(InitRequestsProvider);

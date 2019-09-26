import React from "react";
import { connect } from "react-redux";
import { ReduxState } from "../reduxx/reducer";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { isAuth } from "../ducks/auth";

interface StatedProps {
  isAuth: boolean;
}

interface Props extends StatedProps, RouteComponentProps {}

const requireAuth = <P extends object>(ComposedComponent: React.ComponentType<P>) => {
  class RequireAuth extends React.Component<Props> {
    componentDidMount() {
      this._checkAndRedirect();
    }

    componentDidUpdate() {
      this._checkAndRedirect();
    }

    _checkAndRedirect() {
      const { isAuth } = this.props;

      if (!isAuth) {
        this.props.history.push("/login")
      }
    }

    public render() {
      return <>{this.props.isAuth ? <ComposedComponent {...this.props as any} /> : null}</>;
    }
  }

  const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
    isAuth: isAuth(state)
  });

  return connect(mapStateToProps)(withRouter(RequireAuth));
};

export default requireAuth;

import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { IUserDto } from '../../api/requests/user.dto';
import { checkTokenAndGetProfile, ICheckTokenPayload } from '../../ducks/auth';
import { IReduxState } from '../../reduxx/reducer';

interface IInputPropsLocation {
    token: string;
}

interface IState {
    token: string;
}

interface IStatedProps {
    tokenCheckFetching: boolean;
    userProfile: IUserDto;
}

interface IDispatchedProps {
    getUserProfile: (payload: ICheckTokenPayload) => void;
}

interface IProps extends IStatedProps, IDispatchedProps, RouteComponentProps<IInputPropsLocation> {}

class EnterPage extends React.Component<IProps, IState> {
    constructor (props: IProps) {
        super(props);
        const token = this.props.match.params.token;
        this.state = { token };
    }

    public componentDidMount (): void {
        this.props.getUserProfile({ token: this.state.token });
    }

    public render (): JSX.Element {
        if (this.props.userProfile) {
            return <div>{this.props.userProfile.realName}</div>;
        } else {
            return <div>{'TEST'}</div>;
        }
    }
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    userProfile: state.auth.getIn(['userProfile', 'data']) as IUserDto,
    tokenCheckFetching: state.auth.getIn(['userProfile', 'isFetching']) as boolean,
});

export default connect(
    mapStateToProps,
    {
        getUserProfile: checkTokenAndGetProfile.started,
    },
)(withRouter(EnterPage));

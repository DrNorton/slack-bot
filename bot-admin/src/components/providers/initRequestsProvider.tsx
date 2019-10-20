import React, { ReactNode } from 'react';
import { connect } from 'react-redux';

import { IUserDto } from '../../api/requests/user.dto';
import { getProfile, isAuth } from '../../ducks/auth';
import { IReduxState } from '../../reduxx/reducer';

interface IProps extends IStatedProps, IDispatchedProps {
    children: React.ReactNode;
}

interface IDispatchedProps {
    getUserProfile: () => void;
}

interface IStatedProps {
    isAuth: boolean;
    profile: IUserDto;
}

class InitRequestsProvider extends React.Component<IProps> {
    public componentDidMount (): void {
        if (this.props.isAuth && !this.props.profile) {
            this.props.getUserProfile();
        }
    }

    public render (): ReactNode {
        return this.props.children;
    }
}

const mapStateToProps = (state: IReduxState): IStatedProps => ({
    isAuth: isAuth(state),
    profile: state.auth.getIn(['userProfile', 'data']) as IUserDto,
});

export default connect(
    mapStateToProps,
    {
        getUserProfile: getProfile.started,
    },
)(InitRequestsProvider);

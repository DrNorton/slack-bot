import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { isAuth } from '../ducks/auth';
import { IReduxState } from '../reduxx/reducer';

interface IStatedProps {
    isAuth: boolean;
}

interface IProps extends IStatedProps, RouteComponentProps {}

export const requireAuth = <P extends object> (ComposedComponent: React.ComponentType<P>) => {
    const RequireAuth: React.FC<IProps> = (props: IProps): JSX.Element => {
        useEffect(() => {
            if (!props.isAuth) {
                props.history.push('/login');
            }
        });

        return <>{isAuth ? <ComposedComponent {...props as P} /> : null}</>;

    };

    const mapStateToProps = (state: IReduxState): IStatedProps => ({
        isAuth: isAuth(state),
    });

    return connect(mapStateToProps)(withRouter(RequireAuth));
};

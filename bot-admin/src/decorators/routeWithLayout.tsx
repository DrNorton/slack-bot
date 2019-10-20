import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface IProps<T> extends RouteProps {
    layout: any;
    title?: string;
    component: React.ComponentType<T>;
}

const RouteWithLayout = <P extends object>(props: IProps<P>) => {
    const { layout: Layout, title, component: Component, ...rest } = props;

    return (
        <Route
            {...rest}
            render={matchProps => (
                <Layout title={title}>
                    <Component {...matchProps as any} />
                </Layout>
            )}
        />
    );
};

export default RouteWithLayout;

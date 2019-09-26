import React from "react";
import {Route, RouteProps} from "react-router-dom";
import TitleContainerPage from "../components/common/titleContainerPage";
interface Props<T> extends RouteProps{
    layout:any;
    title?:string;
    component:React.ComponentType<T>
}
const RouteWithLayout =  <P extends object>(props:Props<P>) => {
  const { layout: Layout,title, component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <TitleContainerPage title={title}>
            <Component {...(matchProps as any)} />
          </TitleContainerPage>
        </Layout>
      )}
    />
  );
};



export default RouteWithLayout;

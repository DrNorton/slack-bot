import React from "react";
import { Switch } from "react-router-dom";

import MainPage from "./components/pages/main/mainPage";
import MainLayout from "./layouts/mainLayout";
import RouteWithLayout from "./decorators/routeWithLayout";
import FaqListPage from "./components/pages/faq/faqListPage";
import AddFaqItemPage from "./components/pages/faq/addFaqItemPage";
import EnterPage from "./components/pages/auth/enterPage";
import loginPage from "./components/pages/auth/loginPage";
import MinimalLayout from "./layouts/minimalLayout";
import requireAuth from "./decorators/requireAuth";
import ScorePage from "./components/pages/score/scorePage";
import ScoreSettingsPage from "./components/pages/score/settings/scoreSettingsPage";

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout
        component={requireAuth(MainPage)}
        exact={true}
        layout={MainLayout}
        path="/"
      />
      <RouteWithLayout
        component={requireAuth(FaqListPage)}
        exact={true}
        layout={MainLayout}
        path="/faq"
      />
      <RouteWithLayout
        component={requireAuth(AddFaqItemPage)}
        exact={true}
        layout={MainLayout}
        path="/faq/add"
      />
      <RouteWithLayout
        component={requireAuth(AddFaqItemPage)}
        exact={true}
        layout={MainLayout}
        path="/faq/edit/:faqItemId"
      />
      <RouteWithLayout
        component={requireAuth(ScorePage)}
        exact={true}
        layout={MainLayout}
        path="/score"
      />

      <RouteWithLayout
        component={requireAuth(ScoreSettingsPage)}
        exact={true}
        layout={MainLayout}
        path="/score/settings"
      />
      <RouteWithLayout
        component={loginPage}
        exact={true}
        layout={MinimalLayout}
        path="/login"
      />
      <RouteWithLayout
        component={loginPage}
        exact={true}
        layout={MinimalLayout}
        path="/login/:token"
      />
    </Switch>
  );
};

export default Routes;

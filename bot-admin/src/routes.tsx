import React from "react";
import { Switch } from "react-router-dom";
import MainPage from "./pages/main/mainPage";
import MainLayout from "./layouts/mainLayout";
import RouteWithLayout from "./decorators/routeWithLayout";
import FaqListPage from "./pages/faq/faqListPage";
import AddFaqItemPage from "./pages/faq/addFaqItemPage";
import loginPage from "./pages/auth/loginPage";
import MinimalLayout from "./layouts/minimalLayout";
import requireAuth from "./decorators/requireAuth";
import ScorePage from "./pages/score/scorePage";
import ScoreSettingsPage from "./pages/score/settings/scoreSettingsPage";
import BookingSchedulePage from "./pages/bookingRoom/schedule/bookingSchedulePage";
import MeetingRoomsPage from "./pages/bookingRoom/rooms/list/meetingRoomsPage";
import AddOrEditRoomPage from "./pages/bookingRoom/rooms/addOrEdit/addOrEditRoomPage";
import SettingsPage from "./pages/bookingRoom/rooms/settings/settingsPage";

const Routes = () => {
  return (
    <Switch>
      <RouteWithLayout
        title="Главный"
        component={requireAuth(MainPage)}
        exact={true}
        layout={MainLayout}
        path="/"
      />
      <RouteWithLayout
        title="Faq"
        component={requireAuth(FaqListPage)}
        exact={true}
        layout={MainLayout}
        path="/faq"
      />
      <RouteWithLayout
        title="Добавление вопроса"
        component={requireAuth(AddFaqItemPage)}
        exact={true}
        layout={MainLayout}
        path="/faq/add"
      />
      <RouteWithLayout
        title="Редактирование"
        component={requireAuth(AddFaqItemPage)}
        exact={true}
        layout={MainLayout}
        path="/faq/edit/:faqItemId"
      />
      <RouteWithLayout
        title="Счёт"
        component={requireAuth(ScorePage)}
        exact={true}
        layout={MainLayout}
        path="/score"
      />

      <RouteWithLayout
        title="Настройки"
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
      <RouteWithLayout
        title="Бронирование переговорок"
        component={requireAuth(BookingSchedulePage)}
        exact={true}
        layout={MainLayout}
        path="/booking/schedule"
      />

      <RouteWithLayout
        title="Комнаты"
        component={requireAuth(MeetingRoomsPage)}
        exact={true}
        layout={MainLayout}
        path="/booking/rooms"
      />

      <RouteWithLayout
        title="Настройки"
        component={requireAuth(SettingsPage)}
        exact={true}
        layout={MainLayout}
        path="/booking/settings"
      />

      <RouteWithLayout
        title="Настройки"
        component={requireAuth(SettingsPage)}
        exact={true}
        layout={MainLayout}
        path="/booking/settings/:tab"
      />

      <RouteWithLayout
        title="Добавление"
        component={requireAuth(AddOrEditRoomPage)}
        exact={true}
        layout={MainLayout}
        path="/booking/rooms/add"
      />

      <RouteWithLayout
        title="Добавление"
        component={requireAuth(AddOrEditRoomPage)}
        exact={true}
        layout={MainLayout}
        path="/booking/rooms/:roomId"
      />
    </Switch>
  );
};

export default Routes;

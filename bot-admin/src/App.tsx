import React from "react";
import { configuredStore, history } from "./reduxx";
import { Provider } from "react-redux";
import "./App.css";
import { MuiThemeProvider } from "@material-ui/core";
import ApiErrorProvider from "./components/providers/apiErrorProvider";
import { ConnectedRouter } from "connected-react-router";
import "./assets/scss/index.scss";
import theme from "./theme";
import Routes from "./routes";
import InitRequestsProvider from "./components/providers/initRequestsProvider";
require("dotenv").config();

function App() {
  return (
    <Provider store={configuredStore}>
      <MuiThemeProvider theme={theme}>
        <InitRequestsProvider>
          <ApiErrorProvider>
            <ConnectedRouter history={history}>
              <Routes />
            </ConnectedRouter>
          </ApiErrorProvider>
        </InitRequestsProvider>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;

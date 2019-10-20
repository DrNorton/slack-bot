import { MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Provider } from 'react-redux';

import './App.css';
import './assets/scss/index.scss';
import ApiErrorProvider from './components/providers/apiErrorProvider';
import InitRequestsProvider from './components/providers/initRequestsProvider';
import { configuredStore, history } from './reduxx';
import Routes from './routes';
import theme from './theme';

require('dotenv').config();

function App (): JSX.Element {
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

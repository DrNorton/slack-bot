import { Store, createStore, applyMiddleware, compose } from "redux";
import createAppReducer, { ReduxState } from "./reducer";
import rootSaga from "./saga";
import logger from "redux-logger";
import { createBrowserHistory } from "history";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from 'redux-devtools-extension';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
export let configuredStore: Store<ReduxState>;
const appReducer = createAppReducer(history);
const composedEnhancers = composeWithDevTools(
  applyMiddleware(logger, sagaMiddleware, routerMiddleware(history))
);

configuredStore = createStore(appReducer, composedEnhancers);

// запуск саг
sagaMiddleware.run(rootSaga);

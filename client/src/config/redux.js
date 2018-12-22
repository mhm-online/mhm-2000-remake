import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";
import * as reducers from "../ducks";

import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

export function getSagaMiddleware() {
  return sagaMiddleware;
}

export function getMiddlewares() {
  let middlewares = [thunk, promiseMiddleware(), sagaMiddleware];
  return middlewares;
}

export function getReducers() {
  return reducers;
}

export function getEnhancers() {
  return [];
}

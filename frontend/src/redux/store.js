import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";

import reducer from "./reducer";
import thunk from "redux-thunk";

const middlewares = [thunk, logger];

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);


  export const store = createStore(persistedReducer, applyMiddleware(...middlewares));
  export const persistor = persistStore(store);
  export default { store, persistor };

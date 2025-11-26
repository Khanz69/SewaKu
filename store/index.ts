// store/index.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { Storage } from "redux-persist";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import entriesReducer from "../features/entries/entriesSlice";

const rootReducer = combineReducers({
  entries: entriesReducer,
});

const createNoopStorage = (): Storage => {
  const store = new Map<string, string>();
  return {
    getItem: async (key) => (store.has(key) ? store.get(key)! : null),
    setItem: async (key, value) => {
      store.set(key, value);
      return value;
    },
    removeItem: async (key) => {
      store.delete(key);
      return;
    },
  } as Storage;
};

const resolveStorage = (): Storage => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    return AsyncStorage as Storage;
  } catch (error) {
    console.warn("⚠️ AsyncStorage tidak tersedia, menggunakan penyimpanan sementara", error);
    return createNoopStorage();
  }
};

const persistConfig = {
  key: "root",
  storage: resolveStorage(),
  whitelist: ["entries"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

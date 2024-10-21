import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import immutableTransform from 'redux-persist-transform-immutable';
import { createWrapper } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './state';

const middleware = [thunkMiddleware];

const makeStore = () => {
    const isServer = typeof window === 'undefined';

    if (isServer) {
        return configureStore({
            reducer: rootReducer,
            middleware,
        });
    } else {
        const persistConfig = {
            transforms: [immutableTransform()],
            key: 'root',
            storage,
            whitelist: ['todo'], // persist reducer e.g. login
        };

        const persistedReducer = persistReducer(persistConfig, rootReducer);

        const store = configureStore({
            reducer: persistedReducer,
            middleware,
        });
        store.__persistor = persistStore(store);

        return store;
    }
};

const wrapper = createWrapper(makeStore, {
    // debug: true,
    serializeState: state => JSON.stringify(state),
    // deserializeState: (state) => JSON.parse(state)
});

export { wrapper };

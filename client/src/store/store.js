import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
//import { authSlice } from "../features";
import authReducer from "../features/auth/authSlice.js";
import tripReducer from "../features/trip/tripSlice.js";

// persist configuration
// const persistConfig = {
//     key: "root",
//     storage,
// };

// // Combine reducers
// const rootReducer = combineReducers({
//     auth: authReducer,
//     trip: tripReducer,
// });

// // persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure the store with the persisted reducer
// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false, // disable check if needed for redux-persist actions
//         }),
// });

// // Create the persistor instance
// export const persistor = persistStore(store);
// export default store;

const store = configureStore({
    reducer: { auth: authReducer, trip: tripReducer },
});
export default store;

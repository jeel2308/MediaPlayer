import { createStore, combineReducers } from "redux";
import urlReducer from "../reducers/urlReducer";
import fileListReducer from "../reducers/fileListReducer";
const store = createStore(
  combineReducers({ urlState: urlReducer, fileList: fileListReducer })
);

export default store;

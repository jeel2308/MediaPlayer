import React from "react";
import ReactDOM from "react-dom";
import App from "./js/App";
import { Provider } from "react-redux";
import store from "./store/configStore";
import "./css/index.css";

const Main = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
store.subscribe(() => {
  console.log(store.getState());
});
ReactDOM.render(<Main />, document.getElementById("root"));

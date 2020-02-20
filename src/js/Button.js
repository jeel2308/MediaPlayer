import React from "react";
import { IconContext } from "react-icons";
import "../css/buttons.css";
class Button extends React.PureComponent {
  render() {
    return (
      <>
        <IconContext.Provider value={{ className: "fontSize" }}>
          {this.props.children}
        </IconContext.Provider>
      </>
    );
  }
}

export default Button;

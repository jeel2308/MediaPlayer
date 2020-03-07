import React from "react";
import { IconContext } from "react-icons";
import "../css/buttons.css";

class SkipBtn extends React.PureComponent {
  render() {
    return (
      <div
        onClick={this.props.type ? this.props[this.props.type] : () => {}}
        className="wrapper"
      >
        <IconContext.Provider value={{ className: this.props.classValue }}>
          {this.props.children}
        </IconContext.Provider>
      </div>
    );
  }
}

export default SkipBtn;

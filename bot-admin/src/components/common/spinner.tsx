import React from "react";
import { css } from "@emotion/core";
// Another way to import. This is recommended to reduce bundle size
import ClipLoader from "react-spinners/ClipLoader";
import {HashLoader} from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;


interface Props{
    isLoading:true;
}
export default class Spinner extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="sweet-loading">
        <HashLoader
            css={override}
          sizeUnit={"px"}
          size={150}
          color={"#123abc"}
          loading={this.props.isLoading}
        />
      </div>
    );
  }
}

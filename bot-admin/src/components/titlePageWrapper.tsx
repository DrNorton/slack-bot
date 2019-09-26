import * as React from "react";
import {
    AppBar,
    Button,
    CircularProgress, IconButton,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ImageSearch } from "@material-ui/icons";

interface Props {
  children?: React.ReactNode;
  title: string;
  isError: boolean;
  isBlockingLoader?: boolean;
  isLinearLoader?: boolean;
  additionalButtons?:React.ReactNode;
}

export default class TitlePageWrapper extends React.Component<Props> {
  public render() {
    const isError = this.props.isError;
    let content;
    if (isError) {
      content = (
        <div style={{ display: "flex" }}>
          <ErrorOutline />
          <Typography style={{ marginLeft: 10 }} variant="body1">
            Контент не может быть отображён из-за ошибки
          </Typography>
        </div>
      );
    } else if (this.props.isBlockingLoader) {
      content = (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CircularProgress />
          <Typography style={{ marginLeft: 5 }} variant="body1">
            Подождите ...
          </Typography>
        </div>
      );
    } else {
      content = this.props.children;
    }

    return (
      <>
        {this.props.isLinearLoader && <LinearProgress color="primary" />}

        <div style={{ padding: 15, margin: 10 }}>{content}</div>
      </>
    );
  }
}

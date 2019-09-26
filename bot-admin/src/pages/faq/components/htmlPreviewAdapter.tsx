import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export default class HtmlPreviewAdapter extends React.Component<
  FieldRenderProps<string, HTMLInputElement>
> {
  public render() {
    return (

        <div dangerouslySetInnerHTML={{ __html: this.props.input.value }} />

    );
  }
}

import * as React from "react";
import ToggleChannelButton, { ToggleChannelType } from "./toggleChannelButtons";
import { FieldRenderProps } from "react-final-form";

interface ToggleChannelButtonsFormAdapterProps {
  channelType?: ToggleChannelType;
}

const ToggleChannelButtonsFormAdapter: React.SFC<
  FieldRenderProps<boolean, HTMLInputElement> &
    ToggleChannelButtonsFormAdapterProps
> = ({
  channelType,
  input: { value, onChange },

  ...rest
}) => (
  <ToggleChannelButton
    channelType={channelType}
    template={value}
    onChange={onChange}
  />
);

export default ToggleChannelButtonsFormAdapter;

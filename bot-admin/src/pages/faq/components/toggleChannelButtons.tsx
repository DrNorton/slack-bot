import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faSms,
  faEnvelopeSquare,
  faMobileAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(faSms, faEnvelopeSquare, faMobileAlt);



interface Props {
  template: any;
  onChange: (selected: boolean) => void;
  channelType?:ToggleChannelType;
}

export enum ToggleChannelType{
    push,email,sms
}

export default class ToggleChannelButton extends React.Component<Props> {
  public render() {
      let icon;
switch (this.props.channelType) {
case ToggleChannelType.email:
    icon=(   <FontAwesomeIcon icon="envelope-square" />);
    break;
    case ToggleChannelType.sms:
        icon=(   <FontAwesomeIcon icon="sms" />);
        break;

    case ToggleChannelType.push:
        icon=(   <FontAwesomeIcon  icon="mobile-alt" />);
        break;
}
    return (
      <div>
        <ToggleButtonGroup
          exclusive
          size="large"
          value={this.props.template ? "channel" : undefined}
          onChange={(e, selected) =>
            selected === "channel"
              ? this.props.onChange(true)
              : this.props.onChange(false)
          }
        >
          <ToggleButton value="channel">
            {icon}
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    );
  }
}

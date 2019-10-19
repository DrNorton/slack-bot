import { ApiModelProperty } from '@nestjs/swagger';

export default class AppointmentDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  roomId: number;
  @ApiModelProperty()
  title: string;
  @ApiModelProperty()
  desc: string;
  @ApiModelProperty()
  start: Date;
  @ApiModelProperty()
  end: Date;
}

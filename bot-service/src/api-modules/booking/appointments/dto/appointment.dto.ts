import { ApiModelProperty } from '@nestjs/swagger';
import MemberDto from '../../../members/dto/member.dto';

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
  @ApiModelProperty()
  members: MemberDto[];
}

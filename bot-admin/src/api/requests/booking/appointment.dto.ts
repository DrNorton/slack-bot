import { IMemberDto } from '../member.dto';

export interface IAppointmentDto {
    id: number;
    roomId: number;
    title: string;
    desc: string;
    start: Date;
    end: Date;
    members: IMemberDto[];
}

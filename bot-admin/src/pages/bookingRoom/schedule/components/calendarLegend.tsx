import { Typography } from '@material-ui/core';
import React from 'react';
import { IRoomDto } from '../../../../api/requests/booking/room.dto';

interface IProps {
    rooms: IRoomDto[];
}

const CalendarLegend = (props: IProps) => {
    return (
        <>
            {props.rooms.map(room => (
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                    <div style={{ background: room.color, width: '20px', height: '20px' }} />
                    <Typography variant="body1" style={{ marginLeft: '2px' }}>
                        {room.name}
                    </Typography>
                </div>
            ))}
        </>
    );
};

export default CalendarLegend;

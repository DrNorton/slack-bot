import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { IAppointment } from '../../../../ducks/booking/appointment';

interface IProps {
    event: IAppointment;
}

const useStyles = makeStyles(() => ({
    root: {},
}));

const EventView = (props: IProps) => {
    return (
        <div>
            <Typography variant="h1">Бронирование</Typography>
        </div>
    );
};

export default EventView;

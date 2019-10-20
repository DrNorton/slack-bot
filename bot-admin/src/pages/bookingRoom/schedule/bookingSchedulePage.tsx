import '@fullcalendar/core/main.css';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@fullcalendar/daygrid/main.css';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/list/main.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/timegrid/main.css';
import timelinePlugin from '@fullcalendar/timeline';
import { Card, CardContent, colors, createStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import TitleContainerPage from '../../../components/common/titleContainerPage';
import { getAppointments, getAppointmentsWithRoomsSelector, IAppointment } from '../../../ducks/booking/appointment';
import { getRooms } from '../../../ducks/booking/rooms';
import { IReduxState } from '../../../reduxx/reducer';
import CalendarToolbar from './components/calendarToolbar';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100%',
            '& .fc-unthemed td': {
                borderColor: theme.palette.divider,
            },
            '& .fc-widget-header': {
                backgroundColor: colors.grey[50],
            },
            '& .fc-axis': {
                ...theme.typography.body2,
            },
            '& .fc-list-item-time': {
                ...theme.typography.body2,
            },
            '& .fc-list-item-title': {
                ...theme.typography.body1,
            },
            '& .fc-list-heading-main': {
                ...theme.typography.h6,
            },
            '& .fc-list-heading-alt': {
                ...theme.typography.h6,
            },
            '& .fc th': {
                borderColor: theme.palette.divider,
            },
            '& .fc-day-header': {
                ...theme.typography.subtitle2,
                fontWeight: 500,
                color: theme.palette.text.secondary,
                padding: theme.spacing(1),
                backgroundColor: colors.grey[50],
            },
            '& .fc-day-top': {
                ...theme.typography.body2,
            },
            '& .fc-highlight': {
                backgroundColor: colors.blueGrey[50],
            },
            '& .fc-event': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderWidth: 2,
                opacity: 0.9,
                '& .fc-time': {
                    ...theme.typography.h6,
                    color: 'inherit',
                },
                '& .fc-title': {
                    ...theme.typography.body1,
                    color: 'inherit',
                },
            },
            '& .fc-list-empty': {
                ...theme.typography.subtitle1,
            },
        },
        card: {
            marginTop: theme.spacing(3),
        },
    }),
);

interface IStatedProps {
    appointments: IAppointment[];
    roomsExists: boolean;
}

interface IDispatchedProps {
    getAppointments: () => void;
    getRooms: () => void;
}

interface IProps extends IStatedProps, IDispatchedProps {}

const BookingSchedulePage = (props: IProps) => {
    const classes = useStyles();
    const calendarRef = useRef(null);
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const [view, setView] = useState(mobileDevice ? 'listWeek' : 'dayGridMonth');
    const [date, setDate] = useState(moment().toDate());

    const [eventModal, setEventModal] = useState({
        open: false,
        event: null,
    });

    useEffect(() => {
        let mounted = true;

        const fetchEvents = () => {
            props.getAppointments();
            if (!props.roomsExists) {
                props.getRooms();
            }
        };

        fetchEvents();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (calendarRef && calendarRef.current) {
            // @ts-ignore
            const calendarApi = calendarRef.current.getApi();
            const newView = mobileDevice ? 'listWeek' : 'dayGridMonth';

            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [mobileDevice]);

    const handleDateToday = () => {
        // @ts-ignore
        const calendarApi = calendarRef.current.getApi();

        calendarApi.today();
        setDate(calendarApi.getDate());
    };

    const handleViewChange = (viewState: string) => {
        // @ts-ignore
        const calendarApi = calendarRef.current.getApi();

        calendarApi.changeView(viewState);
        setView(viewState);
    };

    const handleDatePrev = () => {
        // @ts-ignore
        const calendarApi = calendarRef.current.getApi();

        calendarApi.prev();
        setDate(calendarApi.getDate());
    };

    const handleDateNext = () => {
        // @ts-ignore
        const calendarApi = calendarRef.current.getApi();

        calendarApi.next();
        setDate(calendarApi.getDate());
    };

    return (
        <TitleContainerPage subtitle="Бронирование" title="Calendar">
            <div className={classes.root}>
                <CalendarToolbar
                    date={date}
                    onDateNext={handleDateNext}
                    onDatePrev={handleDatePrev}
                    onDateToday={handleDateToday}
                    onEventAdd={() => console.log('add event')}
                    onViewChange={handleViewChange}
                    view={view}
                />
                <Card className={classes.card}>
                    <CardContent>
                        {props.appointments.length > 0 && (
                            <FullCalendar
                                allDayMaintainDuration
                                defaultDate={date}
                                defaultView={view}
                                droppable
                                editable
                                eventResizableFromStart
                                events={props.appointments}
                                header={false}
                                height={800}
                                plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                    listPlugin,
                                    timelinePlugin,
                                ]}
                                ref={calendarRef}
                                rerenderDelay={10}
                                selectable
                                weekends
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </TitleContainerPage>
    );
};

const mapStateToProps = (state: IReduxState): IStatedProps => ({
    appointments: getAppointmentsWithRoomsSelector(state),
    roomsExists: state.rooms.get('rooms').count() !== 0,
});

export default connect<IStatedProps, IDispatchedProps, void, IReduxState>(
    mapStateToProps,
    {
        getAppointments: getAppointments.started,
        getRooms: getRooms.started,
    },
)(BookingSchedulePage);

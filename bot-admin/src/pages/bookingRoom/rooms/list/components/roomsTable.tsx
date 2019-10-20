import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IRoomDto } from '../../../../../api/requests/booking/room.dto';
import { IRoomAttributeTypeDto } from '../../../../../api/requests/booking/roomAttribute.dto';
import ColorView from '../../addOrEdit/components/colorViewer';
import TableEditBar from './tableEditBar';

interface IProps extends RouteComponentProps {
    attributeTypes: IRoomAttributeTypeDto[];
    onDelete: (selected: number[]) => void;
    rooms: IRoomDto[];
    isFetching: boolean;
}

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0,
    },
    inner: {
        minWidth: 700,
    },
    nameCell: {
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        height: 42,
        width: 42,
        marginRight: theme.spacing(1),
    },
    actions: {
        padding: theme.spacing(1),
        justifyContent: 'flex-end',
    },
}));

function RoomsTable (props: IProps): JSX.Element {
    const classes = useStyles();
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const rooms = props.isFetching ? Array.from(new Array(6)) : props.rooms;

    function handleEdit (room: IRoomDto): void {
        props.history.push(`/booking/rooms/${room.id}`);
    }

    const handleSelectAll = event => {
        const selectedRoom = event.target.checked ? props.rooms.filter(x => x.id).map((room: IRoomDto) => room.id) : [];
        if (selectedRoom) {
            setSelectedRooms(selectedRoom);
        }
    };

    const handleSelectOne = (event: any, id: number) => {
        const selectedIndex = selectedRooms.indexOf(id);
        let newSelectedRooms: number[] = [];

        if (selectedIndex === -1) {
            newSelectedRooms = newSelectedRooms.concat(selectedRooms, id);
        } else if (selectedIndex === 0) {
            newSelectedRooms = newSelectedRooms.concat(selectedRooms.slice(1));
        } else if (selectedIndex === selectedRooms.length - 1) {
            newSelectedRooms = newSelectedRooms.concat(selectedRooms.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedRooms = newSelectedRooms.concat(selectedRooms.slice(0, selectedIndex), selectedRooms.slice(selectedIndex + 1));
        }

        setSelectedRooms(newSelectedRooms);
    };

    function onDelete (): void {
        props.onDelete(selectedRooms);
    }

    return (
        <div>
            <Card>
                <CardHeader title="Все переговорки" />
                <Divider />
                <CardContent className={classes.content}>
                    <PerfectScrollbar>
                        <div className={classes.inner}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedRooms.length === props.rooms.length}
                                                color="primary"
                                                indeterminate={selectedRooms.length > 0 && selectedRooms.length < props.rooms.length}
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                        <TableCell padding="checkbox">Цвет</TableCell>
                                        <TableCell>Название</TableCell>
                                        {props.attributeTypes.map(type => (
                                            <TableCell>{type.name}</TableCell>
                                        ))}
                                        <TableCell align="right">Действия</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rooms.map(room => (
                                        <div key={room.id}>
                                            {props.isFetching ? (
                                                <TableRow hover>
                                                    <TableCell colSpan={20}>
                                                        <Skeleton height={20} width="100%" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                <TableRow hover key={room.id}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedRooms.indexOf(room.id) !== -1}
                                                            color="primary"
                                                            onChange={event => handleSelectOne(event, room.id)}
                                                            value={selectedRooms.indexOf(room.id) !== -1}
                                                        />
                                                    </TableCell>
                                                    <TableCell padding="checkbox">
                                                        <ColorView color={room.color} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={classes.nameCell}>
                                                            <Avatar className={classes.avatar} src={room.image} />
                                                            {room.name}
                                                        </div>
                                                    </TableCell>
                                                    {room.attributes.map(attribute => (
                                                        <TableCell>{attribute.value ? attribute.value : '-'}</TableCell>
                                                    ))}

                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleEdit(room)}>
                                                            <Edit />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </div>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </PerfectScrollbar>
                </CardContent>
            </Card>
            <TableEditBar onDelete={onDelete} selected={selectedRooms} />
        </div>
    );
}

export default withRouter(RoomsTable);

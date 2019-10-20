import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IRoomAttributeDto, IRoomAttributeTypeDto } from '../../../../../api/requests/booking/roomAttribute.dto';
import { addAttributeType, deleteAttributeTypes, getAttributeTypes, getAttributeTypesSelector } from '../../../../../ducks/booking/rooms';
import { IReduxState } from '../../../../../reduxx/reducer';
import TableEditBar from '../../list/components/tableEditBar';
import AddNewAttributeType from '../components/addNewAttributeType';

interface IDispatchedProps {
    getAttributeTypes: () => void;
    addAttributeType: (newType: IRoomAttributeTypeDto) => void;
    deleteAttributeTypes: (ids: number[]) => void;
}

interface IStatedProps {
    attributeTypes: IRoomAttributeTypeDto[];
    isFetching: boolean;
}

interface IProps extends IDispatchedProps, IStatedProps, RouteComponentProps {
    onAdd: (attribute: IRoomAttributeDto) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainPaper: { margin: 2, padding: 5 },
        cardButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 10px',
        },
        content: {
            padding: 0,
        },
        inner: {
            minWidth: 700,
        },
    }),
);

function AttributeTypeTab (props: IProps): JSX.Element {
    const classes = useStyles();
    const [selectedAttributeTypes, setSelectedAttributeTypes] = useState<number[]>([]);

    const attributeTypes = props.isFetching
        ? Array.from(new Array(6))
        : props.attributeTypes;

    const handleSelectAll = event => {
        const selectedAttrTypes = event.target.checked
            ? props.attributeTypes
                .filter(x => x.id)
                .map(attributeType => attributeType.id)
            : [];
        if (selectedAttrTypes) {
            setSelectedAttributeTypes(selectedAttrTypes as number[]);
        }
    };

    const handleSelectOne = (event: any, id: number) => {
        const selectedIndex = selectedAttributeTypes.indexOf(id);
        let newSelectedRooms: number[] = [];

        if (selectedIndex === -1) {
            newSelectedRooms = newSelectedRooms.concat(
                selectedAttributeTypes,
                id,
            );
        } else if (selectedIndex === 0) {
            newSelectedRooms = newSelectedRooms.concat(
                selectedAttributeTypes.slice(1),
            );
        } else if (selectedIndex === selectedAttributeTypes.length - 1) {
            newSelectedRooms = newSelectedRooms.concat(
                selectedAttributeTypes.slice(0, -1),
            );
        } else if (selectedIndex > 0) {
            newSelectedRooms = newSelectedRooms.concat(
                selectedAttributeTypes.slice(0, selectedIndex),
                selectedAttributeTypes.slice(selectedIndex + 1),
            );
        }

        setSelectedAttributeTypes(newSelectedRooms);
    };

    useEffect(() => {
        if (props.attributeTypes.length === 0) {
            props.getAttributeTypes();
        }
    });

    function onDelete (): void {
        props.deleteAttributeTypes(selectedAttributeTypes);
        setSelectedAttributeTypes([]);
    }

    return (
        <>
            <Card>
                <CardContent className={classes.content}>
                    <div className={classes.inner}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={
                                                selectedAttributeTypes.length ===
                                                props.attributeTypes.length
                                            }
                                            color="primary"
                                            indeterminate={
                                                selectedAttributeTypes.length >
                                                0 &&
                                                selectedAttributeTypes.length <
                                                props.attributeTypes.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Тип значения</TableCell>
                                    <TableCell>Значение по-умолчанию</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attributeTypes.map(attribyteType => (
                                    <>
                                        {props.isFetching ? (
                                            <TableRow hover>
                                                <TableCell colSpan={20}>
                                                    <Skeleton
                                                        height={20}
                                                        width="100%"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={
                                                            selectedAttributeTypes.indexOf(
                                                                attribyteType.id,
                                                            ) !== -1
                                                        }
                                                        color="primary"
                                                        onChange={event =>
                                                            handleSelectOne(
                                                                event,
                                                                attribyteType.id,
                                                            )
                                                        }
                                                        value={
                                                            selectedAttributeTypes.indexOf(
                                                                attribyteType.id,
                                                            ) !== -1
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {attribyteType.name}
                                                </TableCell>
                                                <TableCell>String</TableCell>
                                                <TableCell>
                                                    {attribyteType.defaultValue}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardActions className={classes.cardButtons} disableSpacing>
                    <AddNewAttributeType
                        onAdd={newAttribute =>
                            props.addAttributeType(newAttribute)
                        }
                    />
                </CardActions>
            </Card>
            <TableEditBar
                onDelete={onDelete}
                selected={selectedAttributeTypes}
            />
        </>
    );
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    attributeTypes: getAttributeTypesSelector(state),
    isFetching: state.rooms.get('attributeTypesFetching'),
});

export default connect<IStatedProps, IDispatchedProps, void, IReduxState>(
    mapStateToProps,
    {
        getAttributeTypes: getAttributeTypes.started,
        addAttributeType: addAttributeType.started,
        deleteAttributeTypes: deleteAttributeTypes.started,
    },
)(withRouter(AttributeTypeTab));

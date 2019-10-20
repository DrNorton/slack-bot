import { Button } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { IRoomDto } from '../../../../api/requests/booking/room.dto';
import { IRoomAttributeTypeDto } from '../../../../api/requests/booking/roomAttribute.dto';
import TitleContainerPage from '../../../../components/common/titleContainerPage';
import { deleteRooms, getAttributeTypes, getAttributeTypesSelector, getRooms, getRoomsWithAttributesSelector } from '../../../../ducks/booking/rooms';
import { IReduxState } from '../../../../reduxx/reducer';
import RoomsTable from './components/roomsTable';

interface IDispatchedProps {
    getRooms: () => void;
    getAttributeTypes: () => void;
    deleteRooms: (rooms: number[]) => void;
}

interface IStatedProps {
    rooms: IRoomDto[];
    isFetching: boolean;
    attributeTypes: IRoomAttributeTypeDto[];
}

interface IProps extends IDispatchedProps, IStatedProps, RouteComponentProps {}

class MeetingRoomsPage extends React.Component<IProps> {
    public componentDidMount (): void {
        this.props.getRooms();
        this.props.getAttributeTypes();
    }

    public render (): JSX.Element {
        return (
            <TitleContainerPage
                buttons={
                    <Button key="submit" style={{ margin: 5 }} variant="contained" color="primary" onClick={this.onAdd}>
                        Добавить
                    </Button>}
                title="Переговорки"
                subtitle="Бронирование"
            >
                {this.props.attributeTypes && this.props.rooms && (
                    <RoomsTable
                        isFetching={this.props.isFetching}
                        attributeTypes={this.props.attributeTypes}
                        rooms={this.props.rooms}
                        onDelete={selected => this.props.deleteRooms(selected)}
                    />
                )}
            </TitleContainerPage>
        );
    }

    private onAdd = () => {
        this.props.history.push('/booking/rooms/add');
    };
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    rooms: getRoomsWithAttributesSelector(state),
    attributeTypes: getAttributeTypesSelector(state),
    isFetching: state.rooms.get('roomsFetching'),
});

export default connect<IStatedProps, IDispatchedProps, void, IReduxState>(
    mapStateToProps,
    {
        getRooms: getRooms.started,
        getAttributeTypes: getAttributeTypes.started,
        deleteRooms: deleteRooms.started,
    },
)(withRouter(MeetingRoomsPage));

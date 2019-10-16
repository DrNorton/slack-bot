import * as React from "react";
import { ReduxState } from "../../../../reduxx/reducer";
import { connect } from "react-redux";
import RoomDto from "../../../../api/requests/booking/room.dto";
import {
  deleteRooms,
  getAttributeTypes,
  getAttributeTypesSelector,
  getRooms,
  getRoomsWithAttributesSelector
} from "../../../../ducks/booking/rooms";
import { Button } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router";
import { RoomAttributeTypeDto } from "../../../../api/requests/booking/roomAttribute.dto";
import RoomsTable from "./components/roomsTable";
import TitleContainerPage from "../../../../components/common/titleContainerPage";

interface DispatchedProps {
  getRooms: () => void;
  getAttributeTypes: () => void;
  deleteRooms: (rooms: number[]) => void;
}

interface StatedProps {
  rooms: RoomDto[];
  isFetching: boolean;
  attributeTypes: RoomAttributeTypeDto[];
}

interface Props extends DispatchedProps, StatedProps, RouteComponentProps {}

class MeetingRoomsPage extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.getRooms();
    this.props.getAttributeTypes();
  }

  public render() {
    return (
      <TitleContainerPage
        buttons={
          <Button
            key="submit"
            style={{ margin: 5 }}
            variant="contained"
            color="primary"
            onClick={this.onAdd}
          >
            Добавить
          </Button>
        }
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
    this.props.history.push(`/booking/rooms/add`);
  };
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  rooms: getRoomsWithAttributesSelector(state),
  attributeTypes: getAttributeTypesSelector(state),
  isFetching: state.rooms.get("roomsFetching")
});

export default connect<StatedProps, DispatchedProps, void, ReduxState>(
  mapStateToProps,
  {
    getRooms: getRooms.started,
    getAttributeTypes: getAttributeTypes.started,
    deleteRooms: deleteRooms.started
  }
)(withRouter(MeetingRoomsPage));

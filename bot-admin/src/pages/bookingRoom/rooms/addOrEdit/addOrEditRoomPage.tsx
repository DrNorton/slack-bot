import * as React from "react";
import { Formik } from "formik";
import Button from "@material-ui/core/Button";
import RoomForm from "./components/roomForm";
import TitleContainerPage from "../../../../components/common/titleContainerPage";
import { RefObject } from "react";
import { ReduxState } from "../../../../reduxx/reducer";
import { connect } from "react-redux";
import RoomDto from "../../../../api/requests/booking/room.dto";
import {
  addRoom,
  getAttributeTypes,
  getAttributeTypesSelector,
  getEditedItem,
  getRooms
} from "../../../../ducks/booking/rooms";
import { RouteComponentProps, withRouter } from "react-router-dom";
import RoomAttributeDto, {
  RoomAttributeTypeDto
} from "../../../../api/requests/booking/roomAttribute.dto";

interface DispatchedProps {
  addRoom: (dto: RoomDto) => void;
  getRooms: () => void;
  getAttributeTypes: () => void;
}

interface StatedProps {
  attributeTypes: RoomAttributeTypeDto[];
  editedRoom?: RoomDto;
  roomsExists: boolean;
}

interface Props extends DispatchedProps, StatedProps, RouteComponentProps {
  title: string;
}

interface State {
  editedRoomId?: number;
  initialValues?: RoomDto;
  title: string;
}

class AddOrEditRoomPage extends React.Component<Props, State> {
  private formRef: RefObject<Formik<RoomDto>>;
  constructor(props: Props) {
    super(props);
    this.formRef = React.createRef();
    if (props.editedRoom) {
      this.state = { title: "Редактирование" };
    } else {
      this.state = { title: "Новая переговорка" };
    }
  }

  public componentDidMount(): void {
    if (!this.props.roomsExists) {
      this.props.getRooms();
    }
    if (this.props.attributeTypes.length === 0) {
      this.props.getAttributeTypes();
    } else {
      this.setState({
        initialValues: this.createInitValue(this.props)
      });
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (prevProps.attributeTypes !== this.props.attributeTypes) {
      this.setState({
        initialValues: this.createInitValue(this.props)
      });
    }
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
            onClick={this.handleSubmit}
          >
            Сохранить
          </Button>
        }
        subtitle="Бронирование"
        title={this.state.title}
      >
        {this.state.initialValues && (
          <Formik
            enableReinitialize={true}
            ref={this.formRef}
            initialValues={this.state.initialValues}
            onSubmit={this.onSubmit}
            render={props => <RoomForm {...props} />}
          />
        )}
      </TitleContainerPage>
    );
  }

  private handleSubmit = () => {
    if (this.formRef.current) {
      this.formRef.current.handleSubmit(undefined);
    }
  };
  private onSubmit = (model: RoomDto) => {
    this.props.addRoom(model);
    this.props.history.goBack();
  };

  private createInitValue = (props: Props): RoomDto => {
    if (props.editedRoom) {
      return props.editedRoom;
    } else {
      return {
        id: -1,
        name: "",
        color: "#000000",
        attributes: props.attributeTypes.map(type => ({
          value: type.defaultValue,
          attributeType: type
        }))
      };
    }
  };
}



const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  attributeTypes: getAttributeTypesSelector(state),
  roomsExists: state.rooms.get("rooms").count() > 0,
  editedRoom: ownProps.match
    ? getEditedItem(state, parseInt(ownProps.match.params.roomId))
    : undefined
});

export default connect<StatedProps, DispatchedProps, void, ReduxState>(
  mapStateToProps,
  {
    addRoom: addRoom.started,
    getAttributeTypes: getAttributeTypes.started,
    getRooms: getRooms.started
  }
)(withRouter(AddOrEditRoomPage));

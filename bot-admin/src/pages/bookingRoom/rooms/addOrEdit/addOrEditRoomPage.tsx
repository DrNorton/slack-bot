import Button from '@material-ui/core/Button';
import { Formik } from 'formik';
import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { IRoomDto } from '../../../../api/requests/booking/room.dto';
import { IRoomAttributeTypeDto } from '../../../../api/requests/booking/roomAttribute.dto';
import TitleContainerPage from '../../../../components/common/titleContainerPage';
import { addRoom, getAttributeTypes, getAttributeTypesSelector, getEditedItem, getRooms } from '../../../../ducks/booking/rooms';
import { IReduxState } from '../../../../reduxx/reducer';
import RoomForm from './components/roomForm';

interface IDispatchedProps {
    addRoom: (dto: IRoomDto) => void;
    getRooms: () => void;
    getAttributeTypes: () => void;
}

interface IStatedProps {
    attributeTypes: IRoomAttributeTypeDto[];
    editedRoom?: IRoomDto;
    roomsExists: boolean;
}

interface IProps extends IDispatchedProps, IStatedProps, RouteComponentProps {
    title: string;
}

interface IState {
    editedRoomId?: number;
    initialValues?: IRoomDto;
    title: string;
}

class AddOrEditRoomPage extends React.Component<IProps, IState> {
    private formRef: RefObject<Formik<IRoomDto>>;

    constructor (props: IProps) {
        super(props);
        this.formRef = React.createRef();
        if (props.editedRoom) {
            this.state = { title: 'Редактирование' };
        } else {
            this.state = { title: 'Новая переговорка' };
        }
    }

    public componentDidMount (): void {
        if (!this.props.roomsExists) {
            this.props.getRooms();
        }
        if (this.props.attributeTypes.length === 0) {
            this.props.getAttributeTypes();
        } else {
            this.setState({
                initialValues: this.createInitValue(this.props),
            });
        }
    }

    public componentDidUpdate (prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.attributeTypes !== this.props.attributeTypes) {
            this.setState({
                initialValues: this.createInitValue(this.props),
            });
        }
    }

    public render (): JSX.Element {
        return (
            <TitleContainerPage
                buttons={
                    <Button key="submit" style={{ margin: 5 }} variant="contained" color="primary" onClick={this.handleSubmit}>
                        Сохранить
                    </Button>}
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
    private onSubmit = (model: IRoomDto) => {
        this.props.addRoom(model);
        this.props.history.goBack();
    };


    private createInitValue = (props: IProps): IRoomDto => {
        if (props.editedRoom) {
            return props.editedRoom;
        } else {
            return {
                id: -1,
                name: '',
                color: "#000000",
                attributes: props.attributeTypes.map(type => ({
                    value: type.defaultValue,
                    attributeType: type,
                })),
            };
        }
    };
}

const mapStateToProps = (state: IReduxState, ownProps: any): IStatedProps => ({
    attributeTypes: getAttributeTypesSelector(state),
    roomsExists: state.rooms.get('rooms').count() > 0,
    editedRoom: ownProps.match ? getEditedItem(state, parseInt(ownProps.match.params.roomId, 10)) : undefined,
});

export default connect<IStatedProps, IDispatchedProps, void, IReduxState>(
    mapStateToProps,
    {
        addRoom: addRoom.started,
        getAttributeTypes: getAttributeTypes.started,
        getRooms: getRooms.started,
    },
)(withRouter(AddOrEditRoomPage));

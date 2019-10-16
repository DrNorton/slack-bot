import {
  Button,
  colors,
  createStyles,
  Fab,
  makeStyles,
  Theme
} from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ReduxState } from "../../../../../reduxx/reducer";
import {
  addAttributeType,
  deleteAttributeTypes,
  getAttributeTypes,
  getAttributeTypesSelector
} from "../../../../../ducks/booking/rooms";
import RoomAttributeDto, {
  RoomAttributeTypeDto
} from "../../../../../api/requests/booking/roomAttribute.dto";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import CardActions from "@material-ui/core/CardActions";
import AddNewAttributeType from "../components/addNewAttributeType";
import { Skeleton } from "@material-ui/lab";
import Checkbox from "@material-ui/core/Checkbox";
import RoomDto from "../../../../../api/requests/booking/room.dto";
import { RouteComponentProps, withRouter } from "react-router-dom";
import TableEditBar from "../../list/components/tableEditBar";

interface DispatchedProps {
  getAttributeTypes: () => void;
  addAttributeType: (newType: RoomAttributeTypeDto) => void;
  deleteAttributeTypes: (ids: number[]) => void;
}

interface StatedProps {
  attributeTypes: RoomAttributeTypeDto[];
  isFetching: boolean;
}
interface Props extends DispatchedProps, StatedProps, RouteComponentProps {
  onAdd: (attribute: RoomAttributeDto) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainPaper: { margin: 2, padding: 5 },
    cardButtons: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "16px 10px"
    },
    content: {
      padding: 0
    },
    inner: {
      minWidth: 700
    }
  })
);

function AttributeTypeTab(props: Props) {
  const classes = useStyles();
  const [selectedAttributeTypes, setSelectedAttributeTypes] = useState<
    number[]
  >([]);

  const attributeTypes = props.isFetching
    ? Array.from(new Array(6))
    : props.attributeTypes;

  const handleSelectAll = event => {
    const selectedAttributeTypes = event.target.checked
      ? props.attributeTypes
          .filter(x => x.id)
          .map(attributeType => attributeType.id)
      : [];
    if (selectedAttributeTypes) {
      setSelectedAttributeTypes(selectedAttributeTypes as number[]);
    }
  };

  const handleSelectOne = (event: any, id: number) => {
    const selectedIndex = selectedAttributeTypes.indexOf(id);
    let newSelectedRooms: number[] = [];

    if (selectedIndex === -1) {
      newSelectedRooms = newSelectedRooms.concat(selectedAttributeTypes, id);
    } else if (selectedIndex === 0) {
      newSelectedRooms = newSelectedRooms.concat(
        selectedAttributeTypes.slice(1)
      );
    } else if (selectedIndex === selectedAttributeTypes.length - 1) {
      newSelectedRooms = newSelectedRooms.concat(
        selectedAttributeTypes.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedRooms = newSelectedRooms.concat(
        selectedAttributeTypes.slice(0, selectedIndex),
        selectedAttributeTypes.slice(selectedIndex + 1)
      );
    }

    setSelectedAttributeTypes(newSelectedRooms);
  };

  useEffect(() => {
    if (props.attributeTypes.length === 0) {
      props.getAttributeTypes();
    }
  });

  function onDelete() {
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
                        selectedAttributeTypes.length > 0 &&
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
                          <Skeleton height={20} width="100%" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedAttributeTypes.indexOf(
                                attribyteType.id
                              ) !== -1
                            }
                            color="primary"
                            onChange={event =>
                              handleSelectOne(event, attribyteType.id)
                            }
                            value={
                              selectedAttributeTypes.indexOf(
                                attribyteType.id
                              ) !== -1
                            }
                          />
                        </TableCell>
                        <TableCell>{attribyteType.name}</TableCell>
                        <TableCell>String</TableCell>
                        <TableCell>{attribyteType.defaultValue}</TableCell>
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
            onAdd={newAttribute => props.addAttributeType(newAttribute)}
          />
        </CardActions>
      </Card>
      <TableEditBar onDelete={onDelete} selected={selectedAttributeTypes} />
    </>
  );
}

const mapStateToProps = (state: ReduxState, ownProps: any): StatedProps => ({
  attributeTypes: getAttributeTypesSelector(state),
  isFetching: state.rooms.get("attributeTypesFetching")
});

export default connect<StatedProps, DispatchedProps, void, ReduxState>(
  mapStateToProps,
  {
    getAttributeTypes: getAttributeTypes.started,
    addAttributeType: addAttributeType.started,
    deleteAttributeTypes: deleteAttributeTypes.started
  }
)(withRouter(AttributeTypeTab));

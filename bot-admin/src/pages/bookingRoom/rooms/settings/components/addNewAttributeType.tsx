import PopupDialog from "../../../../../components/dialog";
import * as React from "react";
import { useState } from "react";
import {
  Button,
  colors,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import palette from "../../../../../theme/palette";
import TextField from "@material-ui/core/TextField";
import RoomAttributeDto, {
  RoomAttributeTypeDto
} from "../../../../../api/requests/booking/roomAttribute.dto";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    saveButton: {
      color: palette.white,
      backgroundColor: colors.green[600],
      "&:hover": {
        backgroundColor: colors.green[900]
      }
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    form: {
      display: "flex",
      flexDirection: "column"
    }
  })
);

interface Props {
  onAdd: (attributeType: RoomAttributeTypeDto) => void;
}

export default function AddNewAttributeType(props: Props) {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }
  function onSave() {
    props.onAdd({ name: attributeName, defaultValue: defaultValue, id: -1 });
    closeDialog();
  }

  return (
    <>
      <Button
        className={classes.saveButton}
        key="submit"
        variant="contained"
        color="primary"
        onClick={e => openDialog()}
      >
        Добавить
      </Button>
      <PopupDialog
        isOpen={isOpen}
        onClose={closeDialog}
        saveButtonDisabled={false}
        saveClickHandler={onSave}
        title="Новый тип атрибута"
      >
        <div className={classes.form}>
          <TextField
            label="Наименование атрибута"
            onChange={e => setAttributeName(e.target.value)}
            className={classes.textField}
            fullWidth
          />
          <TextField
            label="Значение по-умолчанию"
            onChange={e => setDefaultValue(e.target.value)}
            className={classes.textField}
            fullWidth
          />
        </div>
      </PopupDialog>
    </>
  );
}

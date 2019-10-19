import { Button, colors, createStyles, makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';

import { IRoomAttributeTypeDto } from '../../../../../api/requests/booking/roomAttribute.dto';
import PopupDialog from '../../../../../components/dialog';
import palette from '../../../../../theme/palette';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        saveButton: {
            color: palette.white,
            backgroundColor: colors.green[600],
            '&:hover': {
                backgroundColor: colors.green[900],
            },
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
    }),
);

interface IProps {
    onAdd: (attributeType: IRoomAttributeTypeDto) => void;
}

export default function AddNewAttributeType(props: IProps): JSX.Element {
    const classes = useStyles();
    const [isOpen, setOpen] = useState(false);
    const [attributeName, setAttributeName] = useState('');
    const [defaultValue, setDefaultValue] = useState('');

    function openDialog(): void {
        setOpen(true);
    }

    function closeDialog(): void {
        setOpen(false);
    }

    function onSave(): void {
        props.onAdd({
            name: attributeName,
            defaultValue,
            id: -1,
        });
        closeDialog();
    }

    return (
        <>
            <Button className={classes.saveButton} key="submit" variant="contained" color="primary" onClick={e => openDialog()}>
                Добавить
            </Button>
            <PopupDialog isOpen={isOpen} onClose={closeDialog} saveButtonDisabled={false} saveClickHandler={onSave} title="Новый тип атрибута">
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

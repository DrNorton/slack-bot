import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Field, FieldArray, Form, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import * as React from 'react';

import { IRoomDto } from '../../../../../api/requests/booking/room.dto';
import ImagePicker from './imagePicker';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainPaper: { margin: 2, padding: 5 },
        attributePanel: {
            marginTop: 10,
            marginBottom: 10,
            padding: 10,
        },
        divider: {
            marginTop: 5,
            marginBottom: 5,
        },
    }),
);

interface IProps extends FormikProps<IRoomDto> {}

export default function RoomForm(props: IProps): JSX.Element {
    const classes = useStyles();
    const { values } = props;

    return (
        <Paper className={classes.mainPaper}>
            <Form>
                <Paper className={classes.attributePanel}>
                    <Grid spacing={2} container={true}>
                        <Grid item={true} xs={2}>
                            <ImagePicker
                                onImagePick={url => props.setFieldValue('image', url)}
                                onDeleteImage={() => props.setFieldValue('image', undefined)}
                                value={props.values.image}
                            />
                        </Grid>
                        <Grid item={true} xs={10}>
                            <Field id="name" name="name" label="Name" fullWidth component={TextField} />
                        </Grid>
                    </Grid>
                </Paper>

                <Divider className={classes.divider} />
                <Paper className={classes.attributePanel}>
                    <Typography variant="h5">Аттрибуты:</Typography>
                    <Divider className={classes.divider} />
                    <FieldArray
                        name="attributes"
                        render={() => (
                            <div>
                                {values.attributes && values.attributes.length > 0 ? (
                                    values.attributes.map((attribute, index) => (
                                        <div key={index}>
                                            <Field
                                                id={`attributes[${index}].value`}
                                                name={`attributes[${index}].value`}
                                                label={attribute.attributeType.name}
                                                fullWidth
                                                component={TextField}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <Typography>Атрибуты отсутствуют. Для добавления, нажмите на кнопку \"Добавить\"</Typography>
                                )}
                            </div>
                        )}
                    />
                </Paper>
            </Form>
        </Paper>
    );
}

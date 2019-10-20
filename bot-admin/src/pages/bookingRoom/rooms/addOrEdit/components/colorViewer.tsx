import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        colorPreview: {
            height: '30px',
            width: '30px',
            borderRadius: '4px',
        },
    }),
);

interface IProps {
    color: string;
}

export default function ColorView (props: IProps): JSX.Element {
    const classes = useStyles();
    return <div className={classes.colorPreview} style={{ background: props.color }} />;
}

import { createStyles, makeStyles, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Add, Remove } from '@material-ui/icons';
import clsx from 'clsx';
import * as React from 'react';

interface IProps {
    onChange: (value: number) => void;
    value: number;
    className: any;
}

const useStyles = makeStyles(() =>
    createStyles({
        button: {},
        panel: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
    }),
);

const NumberInput: React.FunctionComponent<IProps> = props => {
    const styles = useStyles();

    function up (): void {
        props.onChange(props.value + 1);
    }

    function down (): void {
        props.onChange(props.value - 1);
    }

    return (
        <div className={clsx(props.className, styles.panel)}>
            <IconButton className={styles.button} onClick={down}>
                <Remove />
            </IconButton>
            <Typography variant="h4">{props.value}</Typography>
            <IconButton className={styles.button} onClick={up}>
                <Add />
            </IconButton>
        </div>
    );
};

export default NumberInput;

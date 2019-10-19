import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import * as React from 'react';

interface IProps {
    title?: string;
    subtitle?: string;
    className?: string;
    children: React.ReactNode;
    buttons?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: { margin: 10 },
        divider: {
            marginTop: 5,
            marginBottom: 5,
        },
        titleWithButton: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        content: {
            marginTop: theme.spacing(3),
        },
        root: {},
    }),
);

const TitleContainerPage: React.FunctionComponent<IProps> = (props: IProps) => {
    const classes = useStyles();
    return (
        <>
            <div className={clsx(classes.root, props.className)}>
                <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
                    <Grid item>
                        {props.subtitle && (
                            <Typography component="h2" gutterBottom variant="overline">
                                {props.subtitle}
                            </Typography>
                        )}

                        <Typography component="h1" variant="h3">
                            {props.title}
                        </Typography>
                    </Grid>
                    <Grid item>{props.buttons}</Grid>
                </Grid>
            </div>
            <div className={classes.content}>{props.children}</div>
        </>
    );
};

export default TitleContainerPage;

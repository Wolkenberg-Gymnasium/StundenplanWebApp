import React from 'react';
import ThemedGridCell from './ThemedGridCell';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(0.5),
        },
        [theme.breakpoints.down('sm')]: {
            weekdayName: {
                display: 'none',
            },
        },
        date: {},
    }),
    'HeaderCell'
);

export default function HeaderCell({ GridCellComponent, className, date, ...other }) {
    const classes = useStyles();
    return (
        <GridCellComponent {...other} className={classNames(classes.root, className)}>
            <Typography variant="body2" className={classes.weekdayName}>
                {date.format('dddd')}
            </Typography>
            <Typography variant="body2" className={classes.date}>
                {date.format('DD.MM.')}
            </Typography>
        </GridCellComponent>
    );
}

HeaderCell.defaultProps = {
    GridCellComponent: ThemedGridCell,
};

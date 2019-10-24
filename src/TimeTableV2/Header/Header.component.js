import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import BackIcon from '@material-ui/icons/ArrowBack';
import NextIcon from '@material-ui/icons/ArrowForward';
import ResetIcon from '@material-ui/icons/ArrowDownward';
import grey from '@material-ui/core/colors/grey';
import classNames from 'classnames';
import OfflinePin from '@material-ui/icons/OfflinePin';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Typography, ListItem, ListItemIcon } from '@material-ui/core';
import TimetableInformation from './TimetableInformation';

const styles = theme => ({
    tableToolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        flex: '1 0 48px',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        tableLayout: 'fixed',
        fontSize: '100%',
    },
    tableHeaderCell: {
        fontSize: '85%',
        textAlign: 'center',
        padding: 0,
    },
    tableHeaderRow: {
        height: 48,
    },
    tableHeaderRowSmall: {
        height: 28,
    },
    today: {
        backgroundColor: grey[400],
    },
    offline: {
        width: 'unset',
        color: theme.palette.text.secondary,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: theme.spacing(2),
        borderRight: `1.5px solid ${theme.palette.divider}`,
        paddingRight: theme.spacing(2),
    },
    offlineText: {
        transition: theme.transitions.create(['max-width']),
        maxWidth: 100,
        textOverflow: 'clip',
        [theme.breakpoints.down('sm')]: {
            maxWidth: 0,
        },
    },
    offlineIcon: {
        transition: theme.transitions.create(['margin-right']),
        [theme.breakpoints.down('sm')]: {
            marginRight: 0,
        },
    },
});

const TimeTableHeader = ({ classes, offline, lastCheck, small, date, id, type, print, isMin, isMax, ...other }) => {
    const dateIterator = date
        ? date
              .clone()
              .startOf('day')
              .weekday(0)
        : moment()
              .startOf('day')
              .weekday(0);
    return (
        <React.Fragment>
            <div className={classNames(classes.tableToolbar, classes.tableHeader)}>
                {/* TODO: Offline State */}
                <TimetableInformation id={id} type={type} print={print} small={small} />
                {print || (
                    <React.Fragment>
                        <IconButton disabled={isMin} onClick={other.setPreviousWeek}>
                            <BackIcon />
                        </IconButton>
                        {small || (
                            <IconButton onClick={other.setThisWeek}>
                                <ResetIcon />
                            </IconButton>
                        )}
                        <IconButton disabled={isMax} onClick={other.setNextWeek}>
                            <NextIcon />
                        </IconButton>
                    </React.Fragment>
                )}
            </div>
            {/* <Table className={classes.tableHeader}>
                <TableHead>
                    <TableRow className={classNames(classes.tableHeaderRow, small && classes.tableHeaderRowSmall)}>
                        <PeriodCell small={small} />
                        {WEEKDAY_NAMES.map((day, i) => {
                            const mDate = dateIterator.clone().add(i, 'days');
                            const isToday =
                                date &&
                                moment()
                                    .startOf('day')
                                    .diff(mDate, 'days') === 0;
                            return (
                                <TableCell
                                    key={i}
                                    className={classNames(classes.tableHeaderCell, isToday && classes.today)}
                                    padding="none"
                                >
                                    {(!small || !date) && mDate.format('dddd')}
                                    {(!small || !date) && <br />}
                                    {date && mDate.format('DD.MM.')}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
            </Table> */}
        </React.Fragment>
    );
};

export default withStyles(styles)(TimeTableHeader);

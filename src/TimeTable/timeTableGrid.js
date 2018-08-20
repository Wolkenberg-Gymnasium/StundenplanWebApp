import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
import PeriodColumn from './period';
import { WEEKDAY_NAMES } from '../Common/const';
import { Print } from 'react-easy-print';
import { changeWeek } from '../Main/actions';
import makeGetCurrentTimetable from '../Selector/timetable';
import Holiday from './Holiday';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BackIcon from '@material-ui/icons/ArrowBack';
import NextIcon from '@material-ui/icons/ArrowForward';
import { ObjectIcon } from '../Main/components/Avatars';
import RoomList from './roomlist';
import Supervision from './supervision';

class TimeTableGrid extends React.Component {
    state = {};

    shouldComponentUpdate(nextProps) {
        // controlled non-updating to update data in background
        return !!nextProps.currentTimetable
            || (nextProps.counterChanged === 'detected' && nextProps.counterChanged !== this.props.counterChanged)
            || this.props.classes !== nextProps.classes;
    }

    static getDerivedStateFromProps(props) {
        return {
            periodsWidth: (props.small) ? 20 : 70,
        }
    }

    renderPeriodTimes(period) {
        const lpad2 = (number) => (number < 10 ? '0' : '') + number;
        return (
            <Times key={period.PERIOD_TIME_ID}>
                <Time>{Math.floor(period.START_TIME / 100)}:{lpad2(period.START_TIME % 100)}</Time>
                <Time>{Math.floor(period.END_TIME / 100)}:{lpad2(period.END_TIME % 100)}</Time>
            </Times>
        );
    }

    renderPeriodHeader(period) {
        return (
            <Periods key={-period.PERIOD_TIME_ID}>
                <Period>{period.PERIOD_TIME_ID - 1}.</Period>
            </Periods>
        )
    }

    renderPeriodsColumn(day, periodNumber) {
        if (!this.props.currentTimetable) { return <TableCell key={day} />; }
        let dayObject = this.props.currentTimetable[day];
        if (dayObject.holiday) {
            if (periodNumber !== 1) return;
            let isNextDay = (this.props.currentTimetable[day - 1] || {}).holiday === dayObject.holiday;
            if (isNextDay) return;
            let colSpan = this.props.currentTimetable.slice(day).filter((dayX) => dayX.holiday === dayObject.holiday).length;
            let date = this.props.date.clone().weekday(0).add(day - 1, 'days');
            return (
                <TableCell
                    key={day}
                    rowSpan={Object.values(this.props.periods).length}
                    style={{ padding: 0 }}
                    colSpan={colSpan}>
                    <Holiday holiday={dayObject.holiday} date={date.format("DD.MM")} />
                </TableCell>
            );
        } else {
            let period = dayObject.periods[periodNumber - 1];
            if (!period) {
                return null;
            }
            return (
                <TableCell
                    key={day}
                    style={{
                        textAlign: 'center', padding: '0.5vmin', overflow: 'visible', fontSize: '100%'
                    }}
                    rowSpan={period ? period.skip + 1 : 0}>
                    {period.supervision &&
                        <Supervision supervision={period.supervision}/>
                    }
                    {period.freeRooms ?
                        <RoomList
                            rooms={period.freeRooms}
                        />
                        :
                        <PeriodColumn
                            continueation={period.continueation}
                            lessons={period.lessons}
                            type={this.props.type}
                            small={this.props.small} />
                    }
                </TableCell>
            );
        }
    }

    renderRows() {
        const periodColumnStyle = {
            width: this.state.periodsWidth,
            fontSize: '100%',
            padding: 2,
        };
        return Object.values(this.props.periods).map((period, i) => (
            <TableRow key={i}>
                <TableCell style={periodColumnStyle}>
                    <div style={{ display: 'flex', alignContent: 'space-between', height: '100%' }}>
                        {!this.props.small && this.renderPeriodTimes(period)}
                        {this.renderPeriodHeader(period)}
                    </div>
                </TableCell>
                {WEEKDAY_NAMES.map((name, i) => this.renderPeriodsColumn(i, period.PERIOD_TIME_ID))}
            </TableRow>
        ));
    }

    render() {
        const { classes, id, type } = this.props;
        const tableHeaderStyle = { fontSize: '85%', textAlign: 'center', padding: 0, height: 42 };
        const currentTimetable = (
            <ConnectedCurrentTimetableInformation id={id} type={type} />
        );

        return (
            <div style={{ flexDirection: 'column', display: 'flex', height: '100%' }}>
                <div className={classes.tableToolbar + " " + classes['table-header']}>
                    {currentTimetable}
                    <IconButton onClick={this.props.setPreviousWeek}>
                        <BackIcon />
                    </IconButton>
                    <IconButton onClick={this.props.setNextWeek}>
                        <NextIcon />
                    </IconButton>
                </div>
                <Print main name="TimeTable">
                    <Table className={classes['table-header']}>
                        <TableHead
                            style={{ fontSize: '100%' }}>
                            <TableRow style={{ height: 48 }}>
                                <TableCell style={{ ...tableHeaderStyle, width: this.state.periodsWidth, padding: 2 }} />
                                {[1, 2, 3, 4, 5].map((day, i) => {
                                    let date = this.props.date.clone().weekday(0).add(day - 1, 'days');
                                    return (
                                        <TableCell
                                            key={i}
                                            style={tableHeaderStyle}
                                        >
                                            {date.format(this.props.small ? 'dd' : 'dddd')}
                                            <br />
                                            {date.format('DD.MM.')}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                    </Table>
                    <div style={{ maxHeight: `calc(100vh - ${180}px)`, overflow: 'hidden auto' }}>
                        <GrayoutTable
                            className={classes.table}
                            disabled={this.props.counterChanged === 'detected'}
                        >
                            <TableBody>
                                {this.renderRows()}
                            </TableBody>
                        </GrayoutTable>
                    </div>
                </Print>
            </div>
        );
    }
}


const CurrentTimetableInformation = ({ id, type, masterdata, avatars }) => {
    if (!masterdata || !type || !id) return null;
    if (type === 'all') {
        type = "room";
    }
    let object = masterdata[type[0].toUpperCase() + type.slice(1)][id];
    if (!object) return null;
    return (
        <ListItem>
            <ListItemIcon><ObjectIcon avatars={avatars} upn={object.UPN} type={type} /></ListItemIcon>
            <ListItemText>{object.LASTNAME ? object.FIRSTNAME + " " + object.LASTNAME : object.NAME}</ListItemText>
        </ListItem>
    )
};

const ConnectedCurrentTimetableInformation = connect(state => ({
    avatars: state.avatars,
    masterdata: state.timetable.masterdata,
}))(CurrentTimetableInformation);


const styles = theme => ({
    timetable: {
        display: 'flex',
    },
    table: {
        backgroundColor: theme.palette.background.default,
        flexShrink: 0,
    },
    'table-header': {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        tableLayout: 'fixed',
    },
    'table-footer': {
        backgroundColor: theme.palette.background.paper,
    },
    tableToolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: 48,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});

const GrayoutTable = styled(Table)`
    ${props => props.disabled && `
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;`
    }
    table-layout: fixed;
    width: 100%;
    height: 100%;
`;

const Times = styled.div`
    font-size:50%;
    flex:1;
    display: flex;
    flex-direction: column;
    padding: 1vmin;
    justify-content: center;
`;
const Time = styled.div`
        
`;
const Periods = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    padding-left: 3px;
    flex:1;
`;
const Period = styled.div`
        
`;

const mapDispatchToProps = dispatch => {
    return {
        setNextWeek: () => dispatch(changeWeek(1)),
        setPreviousWeek: () => dispatch(changeWeek(-1)),
    };
};

const makeMapStateToProps = () => {
    const getCurrentTimetable = makeGetCurrentTimetable()
    const mapStateToProps = (state, props) => {
        return {
            currentTimetable: getCurrentTimetable(state),
            direction: state.timetable.timetableDate.diff(props.date),
            date: state.timetable.timetableDate,
            periods: state.timetable.masterdata.Period_Time,
            id: state.timetable.currentTimeTableId,
            type: state.timetable.currentTimeTableType,
            loading: state.timetable.loadingTimetable || state.timetable.loadingSubstitutions,
            warning: state.user.warning,
            lastCheck: state.user.lastCheck,
            counterChanged: state.user.counterChanged,
        }
    }
    return mapStateToProps;
}


export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TimeTableGrid));
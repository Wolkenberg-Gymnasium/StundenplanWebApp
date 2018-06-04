import React, { Component } from "react";
import styled from "styled-components";
import moment from 'moment';
import { Paper, withStyles } from "@material-ui/core";
import { connect } from 'react-redux';
import MonthView from './month';
import { getDates, deleteDate } from "./actions";
import makeGetCurrentDates from "../Selector/dates";
import AddDialog from "./Dialogs/addDialog";
import List from '@material-ui/core/List';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        height: 500,
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
});

class Dates extends Component {

    constructor(props) {
        super(props);
        this.props.getDates();
        this.state = {
            ...this.calculateStartDate(props.min, props.max),
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.min !== nextProps.min || this.props.max !== nextProps.max) {
            this.setState(this.calculateStartDate(nextProps.min, nextProps.max));
        }
        // if (this.props.timetableDate.week() !== nextProps.timetableDate.week()) {
        //     let index = Math.abs(this.state.min.diff(nextProps.timetableDate.clone().startOf('month'), 'month'));
        //     this.refs[index].scrollToMe();
        // }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.min !== nextProps.min || this.props.max !== nextProps.max) {
            return true;
        }
        // dont mess with timetableDate changing 
        if (this.props.dates !== nextProps.dates) {
            return true;
        }
        return false;
    }

    calculateStartDate(min, max) {
        if (!min || !max) {
            return {};
        }
        let minMoment = moment().year(min.year).week(min.week).startOf('month');
        let maxMoment = moment().year(max.year).week(max.week).startOf('month');
        return {
            min: minMoment, max: maxMoment,
            monthCount: Math.abs(minMoment.diff(maxMoment, 'month')),
        }
    }

    handleOnEdit = (appointment) => {
        this.refs.addDialog.getWrappedInstance().open(appointment);
    }

    handleOnDelete = (appointment) => {
        this.props.deleteDate(appointment);
    }

    handleOnAdd = () => {
        this.refs.addDialog.getWrappedInstance().open();
    }

    renderMonths() {
        let months = [];
        const props = { isAdmin: this.props.isAdmin };
        for (let i = 0; i < this.state.monthCount; i++) {
            months.push(
                <li
                    key={i}
                >
                    <MonthView
                        ref={i}
                        startMonth={this.state.min}
                        index={i}
                        dates={this.props.dates}
                        {...props} />
                </li>
            )
        }
        return months;
    }

    render() {
        const { classes } = this.props;
        return (
            <Container>
                <List className={classes.root} subheader={<li />}>
                    {this.renderMonths()}
                </List>
                <AddDialog ref="addDialog" />
            </Container>
        );
    }
}
const Content = styled.div`
    overflow: auto;
    position: relative;
    max-height: calc(100vh - 200px);
    padding-right: 8px;
    z-index: 0;

`;


const Container = styled(Paper) `
    margin-left: 1vw;
    margin-right: 1vw;
    margin-top: 20px;
    padding: 8px 16px;
    padding-right: 0px;
    z-index: 1;
`;

const makeMapStateToProps = () => {
    const getCurrentDates = makeGetCurrentDates();
    const mapStateToProps = (state, props) => {
        return {
            timetableDate: state.timetable.timetableDate,
            min: state.timetable.masterdata.minMaxDates.min,
            max: state.timetable.masterdata.minMaxDates.max,
            dates: getCurrentDates(state),
            isAdmin: state.user.scope === 'admin'
        }
    }
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
    getDates: () => dispatch(getDates()),
    deleteDate: (date) => dispatch(deleteDate(date)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styles)(Dates)); 
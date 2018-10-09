import React from 'react'
import officeIcons from '../Common/Waffle/office-icons';
import Waffle from '../Common/Waffle/Waffle';
import Drawer from '@material-ui/core/SwipeableDrawer';
import ProfilePicture from '../Main/components/ProfilePicture';
import Divider from '@material-ui/core/Divider';

import grey from '@material-ui/core/colors/grey';
import { withStyles } from '@material-ui/core';
import { toggleDrawer, closeDrawer } from '../Main/actions';
import { connect } from 'react-redux';

const styles = theme => ({
    drawer: {
        width: 300,

    },
    icon: {
        color: grey[100]
    },
    links: {
        padding: theme.spacing.unit * 2,
    },
    linksHeader: {
        color: grey[600],
        paddingBottom: theme.spacing.unit,
    },
    linksList: {
        display: 'flex',
        flexWrap: 'wrap',
    }
})

class AppDrawer extends React.Component {

    handleCloseDrawer = () => {
        this.props.closeDrawer();
    }

    render() {
        const { classes } = this.props;
        const links = (
            <div className={classes.links}>
                <div className={classes.linksHeader}>
                    Apps
                </div>
                <div className={classes.linksList}>
                    {Object.entries(officeIcons).map(([key, value], i) => {
                        return (
                            <Waffle name={key} waffle={value} key={i} onClick={this.handleCloseDrawer} />
                        );
                    })}
                </div>
            </div>
        );
        const drawer = (
            <div className={classes.drawer}>
                <ProfilePicture />
                <Divider />
                {links}
            </div>
        );

        return (
            <div>
                <Drawer
                    variant="temporary"
                    swipeAreaWidth={10}
                    anchor={'left'}
                    open={this.props.open}
                    onClose={this.props.toggleDrawer}
                    onOpen={this.props.toggleDrawer}

                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    open: state.drawer.open,
});

const mapDispatchToProps = dispatch => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppDrawer));

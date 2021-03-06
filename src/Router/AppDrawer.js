import React from 'react';
import officeIcons from '../Common/Waffle/office-icons';
import Waffle from '../Common/Waffle/Waffle';
import Drawer from '@material-ui/core/SwipeableDrawer';
import ProfilePicture from '../Main/components/ProfilePicture';
import Divider from '@material-ui/core/Divider';
import Loadable from 'react-loadable';

import grey from '@material-ui/core/colors/grey';
import { withStyles, Typography } from '@material-ui/core';
import { toggleDrawer, closeDrawer } from '../Main/actions';
import { connect } from 'react-redux';

const styles = (theme) => ({
    drawer: {
        width: 300,
    },
    icon: {
        color: grey[100],
    },
    links: {
        padding: theme.spacing(2),
    },

    linksList: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    link: {
        fontSize: '80%',
        width: 110,
    },
});

class AppDrawer extends React.Component {
    render() {
        const { classes, scope } = this.props;
        const links = (
            <div className={classes.links} onMouseOver={Loadable.preloadAll}>
                <Typography gutterBottom color="textSecondary" variant="body1">
                    Apps
                </Typography>
                <div className={classes.linksList}>
                    {Object.entries(officeIcons)
                        .filter(([key, value]) => value.scope === undefined || value.scope.indexOf(scope) >= 0)
                        .map(([key, value]) => {
                            return (
                                <Waffle
                                    name={key}
                                    waffle={value}
                                    key={key}
                                    onClick={this.props.closeDrawer}
                                    className={classes.link}
                                />
                            );
                        })}
                </div>

                <Typography variant="body1" gutterBottom style={{ marginTop: 10 }} color="textSecondary">
                    <a href="https://portal.office.com/account#installs" target="_blank" rel="noopener noreferrer">
                        Microsoft Office herunterladen
                    </a>
                </Typography>
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
        );
    }
}

const mapStateToProps = (state) => ({
    open: state.drawer.open,
    scope: state.user.scope,
});

const mapDispatchToProps = (dispatch) => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
    closeDrawer: () => dispatch(closeDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppDrawer));

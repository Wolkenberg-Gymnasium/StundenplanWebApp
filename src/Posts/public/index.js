import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';

import { GridList, GridListTile, AppBar, Toolbar, Typography } from '@material-ui/core';
import Post from '../Common/Post';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { getPosts } from '../actions';
import ClockDigital from './ClockDigital';
import ClockAnalog from './ClockAnalog';
import CurrentDate from './CurrentDate';
import DayInfo from './DayInfo';
import TransportInfo from './TransportInfo/TransportInfo';
import { fade } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';
import { EditorState, convertFromRaw } from 'draft-js';
/**
 *
 * @param {import('@material-ui/core').Theme} theme
 */
const styles = theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
    },
    appBar: {
        backgroundColor: indigo[600],
        height: 100,
    },
    content: {
        width: '100%',
        height: '100%',
        padding: 12,
        boxSizing: 'border-box',
    },
    postGridItem: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    post: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 20,
        height: '100%',
    },
    postEnter: {
        opacity: 0,
    },
    postEnterActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 1,
    },
    postExit: {
        opacity: 1,
    },
    postExitActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 0,
    },
    layout: {
        padding: 20,
        width: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    main: {
        padding: theme.spacing(1),
        backgroundColor: fade(theme.palette.background.paper, 0.8),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    toolbar: {
        height: '100%',
        '& > *  ': {
            padding: theme.spacing(0, 4, 0, 0),
        },
    },
    dateTime: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing(1),
    },
    icon: {
        filter: `invert(100%) drop-shadow(1px 1px 0px rgba(0,0,0,0.2))`,
        height: 68,
    },
});

class Posts extends React.Component {
    componentDidMount() {
        this.props.getPosts();
    }

    render() {
        const { classes, posts } = this.props;
        return (
            <TransitionGroup className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <img className={classes.icon} src={require('../../Common/icons/wolkenberg.png')} alt="" />
                        <CurrentDate />
                        <ClockDigital />
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <GridList cellHeight={240} cols={8} spacing={12}>
                        <GridListTile rows={4} cols={2}>
                            <TransportInfo></TransportInfo>
                        </GridListTile>

                        {posts &&
                            posts.map(post => (
                                <GridListTile rows={2} cols={2}>
                                    <CSSTransition
                                        classNames={{
                                            enter: classes.postEnter,
                                            enterActive: classes.postEnterActive,
                                            exit: classes.postExit,
                                            exitActive: classes.postExitActive,
                                        }}
                                        key={post.POST_ID}
                                        timeout={500}
                                    >
                                        <Post
                                            content={EditorState.createWithContent(
                                                convertFromRaw(JSON.parse(post.TEXT))
                                            )}
                                            upn={post.CREATOR}
                                            title={post.TITLE}
                                        />
                                    </CSSTransition>
                                </GridListTile>
                            ))}
                    </GridList>
                </div>
            </TransitionGroup>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
});

const mapDispatchToProps = dispatch => ({
    getPosts: () => dispatch(getPosts()),
});

export default withStyles(styles)(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Posts),
    { name: 'PublicPosts' }
);

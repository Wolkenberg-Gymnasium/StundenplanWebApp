import React from 'react';
import { Route as BrowserRoute, Redirect } from 'react-router-dom';
import { withRouter, matchPath } from 'react-router';
import NotFoundPage from './NotFoundPage';
import { asynchronize } from './asynchronize';

import AppBar from './AppBar';
const AppDrawer = asynchronize(() => import(/* webpackChunkName: "AppDrawer" */ './AppDrawer'));

const Posts = asynchronize(() => import(/* webpackChunkName: "Posts" */ '../Posts'));
const PostEditor = asynchronize(() => import(/* webpackChunkName: "Posts-editIndex" */ '../Posts/editIndex'));
const Main = asynchronize(() => import(/* webpackChunkName: "Main" */ '../Main'));
const MainAppBar = asynchronize(() => import(/* webpackChunkName: "AppBar" */ '../Main/components/AppBar'));
const Statistics = asynchronize(() => import(/* webpackChunkName: "Statistics" */ '../Statistics'));
const Dates = asynchronize(() => import(/* webpackChunkName: "Dates" */ '../Dates'));
const PublicPosts = asynchronize(() => import(/* webpackChunkName: "Posts-public" */ '../Posts/public'));
const PublicTimetable = asynchronize(() => import(/* webpackChunkName: "TimeTable-public" */ '../TimeTable/public'));
const Report = asynchronize(() => import(/* webpackChunkName: "Report" */ '../Report'));
const ReportSum = asynchronize(() => import(/* webpackChunkName: "Report-ReportSum" */ '../Report/ReportSum'));
const NotebookSelector = asynchronize(() => import(/* webpackChunkName: "OneNote" */ '../OneNote'));
const Access = asynchronize(() => import(/* webpackChunkName: "Access" */ '../Access'));

const Route = (props) => {
    const renderComponent = React.useCallback(
        (routerProps) => {
            return <props.component {...props} {...routerProps} />;
        },
        [props]
    );
    return <BrowserRoute {...props} render={renderComponent} component={undefined} />;
};

const routeConfig = (location) => (
    <>
        <Route exact path="/" component={Main} noBoxShadow appBarComponent={MainAppBar} withApp />
        <Route exact path="/public/dates" component={Dates} />
        <Route exact path="/public/posts" component={PublicPosts} />
        <Route exact path="/public/tv" component={PublicTimetable} />
        <Route exact path="/posts" component={Posts} title="InfoTafel" withApp />
        <Route path="/posts/edit/:id" component={PostEditor} title="Beitrag editieren" back withApp />
        <Route path="/posts/new/:type" component={PostEditor} title="Beitrag erstellen" back withApp />
        <Route exact path="/admin" component={Statistics} withApp />
        <Route exact path="/onenote/:directOpen?" component={NotebookSelector} title="Notizbücher" back withApp />
        <Route exact path="/report/:id?" component={Report} title="Bericht" withApp />
        <Route exact path="/reportsum" component={ReportSum} title="Berichtsübersicht" withApp />
        <Route exact path="/access" component={Access} title="Versionsverwaltung" withApp />

        <Route exact path="/error" component={NotFoundPage} />
        <Redirect
            to={{
                pathname: '/error',
                state: { referrer: location, error: 404 },
            }}
            push
        />
    </>
);

class Routes extends React.Component {
    componentDidCatch(error, info) {
        if (process.env.NODE_ENV === 'development') {
            throw error;
        } else {
            const { location } = this.props;
            this.props.history.push({
                pathname: '/error',
                state: { referrer: location, error: 500, message: error.message + '\n' + info.componentStack },
            });
        }
    }

    render() {
        const { location } = this.props;

        let currentRoute, element, computedMatch;

        React.Children.forEach(routeConfig(location).props.children, (child, index) => {
            if (computedMatch || !React.isValidElement(child)) {
                return;
            }
            const route = child.props;
            const path = route.path || route.from;

            computedMatch = matchPath(location.pathname, { ...route, path });
            currentRoute = route;
            element = child;
        });

        let routeComponent = React.cloneElement(element, { location, computedMatch });

        // render AppBar and AppDrawer
        if (currentRoute.withApp) {
            return (
                <>
                    <AppDrawer></AppDrawer>
                    <AppBar {...currentRoute}>{routeComponent}</AppBar>
                </>
            );
        } else {
            return routeComponent;
        }
    }
}

export default withRouter(Routes);

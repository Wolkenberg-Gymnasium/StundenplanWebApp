import React from 'react';
import { Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import SubjectIcon from '@material-ui/icons/Book';
import debounce from 'debounce';
import { makeGetEffectiveAvatar } from '../../Selector/avatars';
import { connect } from 'react-redux';
import { loadAvatars } from '../actions';
import { dispatch } from '../../store';

export const ObjectIcon = ({ type, upn, size, profilePicSize, outline, ...other }) => {
    if (type === 'class') {
        return <ClassIcon {...other} />;
    }
    if (type === 'subject') {
        return <SubjectIcon {...other} />;
    }
    if (type === 'room' || type === 'all') {
        return <RoomIcon {...other} />;
    }
    return <ProfilePicture {...{ upn, size, profilePicSize, outline, ...other }} />;
};

var loadUpns = [];
const dispatchLoad = debounce(() => {
    dispatch(loadAvatars(loadUpns));
    loadUpns = [];
}, 200);
const load = upn => {
    loadUpns.push(upn);
    dispatchLoad();
};

const ProfilePictureComponent = ({
    upn,
    avatar,
    size = 24,
    profilePicSize,
    outline = false,
    loadAvatars,
    ...other
}) => {
    upn && load(upn);
    return avatar && avatar.img ? (
        <Avatar
            src={avatar.img}
            {...(size && { style: { height: profilePicSize || size, width: profilePicSize || size } })}
            {...other}
        />
    ) : outline ? (
        <Avatar {...(size && { style: { height: size, width: size } })} {...other}>
            <PersonIcon />
        </Avatar>
    ) : (
        <PersonIcon {...(size && { style: { height: size, width: size } })} {...other} />
    );
};

const makeMapStateToProps = () => {
    const getEffectiveAvatar = makeGetEffectiveAvatar();
    return (state, props) => ({
        avatar: getEffectiveAvatar(state, props),
    });
};

export const ProfilePicture = connect(
    makeMapStateToProps,
    { loadAvatars: upn => loadAvatars(upn) }
)(ProfilePictureComponent);

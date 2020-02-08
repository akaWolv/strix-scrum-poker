import AppDispatcher from '../dispatcher/AppDispatcher';
import PreviewRoomConstants from '../constants/PreviewRoomConstants';

var PreviewRoomActions = {
    previewRoomByNameAndPassword: function(name, password) {
        AppDispatcher.handleViewAction(PreviewRoomConstants.ACTION_PREVIEW_ROOM_BY_NAME_AND_PASSWORD, {name, password});
    },
    previewRoomById: function(id) {
        AppDispatcher.handleViewAction(PreviewRoomConstants.ACTION_PREVIEW_ROOM_BY_ID, {id});
    },
};

export default PreviewRoomActions;

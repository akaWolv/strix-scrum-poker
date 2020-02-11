import Dispatcher from './Dispatcher';

const AppDispatcher = Object.assign({}, Dispatcher.prototype, {

    handleViewAction: function(action, details) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action,
            details: details
        });
    }

});

export default AppDispatcher;

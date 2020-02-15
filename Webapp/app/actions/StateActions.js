import history from '../handlers/History';

var StateActions = {
    changeState: function (state) {
        // console.log('--------------------------');
        // console.log(this.getCurrentPath() + " <- old vs. new -> " + state);
        // console.log('--------------------------');

        if (this.getCurrentPath() !== state) {
            history.push(state);
        } else {
            // console.log('xxx - no change state - xxx');
        }
    },
    getCurrentPath: function () {
        return location.pathname;
    }
};

export default StateActions;

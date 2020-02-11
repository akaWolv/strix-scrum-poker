import React from 'react';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
// import StateActions from "../actions/StateActions";
import LinkButton from './LinkButton.jsx';

const styles = {
    paper_bottom_nav: {
        marginBottom: 10,
        padding: 20,
        textAlign: 'left'
    },
    paper_bottom_nav_button: {
        width: '100%'
    }
};

class BackBox extends React.Component {
    renderBox(backLink) {
        return <div className="box">
            <Paper style={styles.paper_bottom_nav} elevation={1}>
                <LinkButton
                    color="secondary"
                    variant="outlined"
                    to={backLink}
                    style={styles.paper_bottom_nav_button}>
                    {this.props.backText}
                </LinkButton>
            </Paper>
        </div>;
    }

    render() {
        const {backLink, renderRow} = this.props;

        if (false === renderRow) {
            return this.renderBox(backLink);
        } else {
            return (
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        { this.renderBox(backLink) }
                    </div>
                </div>
            );
        }
    }
}

BackBox.propTypes = {
    backLink: PropTypes.string.isRequired,
    backText: PropTypes.string.isRequired,
    doDisconnectRoom: PropTypes.bool,
    renderRow: PropTypes.bool
};

export default BackBox;

import React from 'react';
import Strix from '../components/Strix';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";

const styles = {
    paper_footer: {
        marginBottom: 20,
        padding: 10
    },
    footer_container: {
        height: '100%',
        textAlign: 'center'
    }
};

class Footer extends React.Component {

    renderBox() {
        return <div className="box">
            <Paper style={styles.paper_footer} elevation={1}>
                <div style={styles.footer_container}>
                    <center>
                        Brought to you by <Strix/>
                    </center>
                </div>
            </Paper>
        </div>;
    }

    render() {
        const {renderRow} = this.props;

        if (false === renderRow) {
            return this.renderBox();
        } else {
            return (
                <div className="row center-xs">
                    <div className="col-xs-12 col-sm-6 col-md-4">
                        { this.renderBox() }
                    </div>
                </div>
            );
        }
    }
}

Footer.propTypes = {
    renderRow: PropTypes.bool
};

export default Footer;



import React from 'react';
import Strix from '../components/Strix';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import GitHubButton from 'react-github-btn'

const styles = {
    paper_footer: {
        marginBottom: 20,
        padding: 10,
        paddingTop: 15
    },
    footer_container: {
        height: '100%',
        textAlign: 'center'
    },
};

class Footer extends React.Component {

    renderBox() {
        return <div className="box">
            <Paper style={styles.paper_footer} elevation={1}>
                <div className="row center-xs">
                    <div className="col-xs-12 col-sm-6">
                        <GitHubButton href="https://github.com/akaWolv" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-size="large" aria-label="Follow @akaWolv on GitHub">Follow @akaWolv</GitHubButton>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <GitHubButton href="https://github.com/akaWolv/strix-scrum-poker/issues" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-issue-opened" data-size="large" data-show-count="true" aria-label="Issue akaWolv/strix-scrum-poker on GitHub">Issue</GitHubButton>
                    </div>
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



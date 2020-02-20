import React from 'react';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';

import LinkButton from './LinkButton.jsx';
import StatesConstants from "../constants/StatesConstants";

import BackspaceIcon from '@material-ui/icons/Backspace';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import TvIcon from '@material-ui/icons/Tv';

const texts = {
    default_text: 'Quit'
};
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
    static pickIcon(icon) {
        switch (icon) {
            case BackBox.icon.TV:
                return <TvIcon/>;
            case BackBox.icon.VOTE:
                return <GroupAddIcon/>;
            case BackBox.icon.BACK:
            default:
                return <BackspaceIcon/>;
        }
    }

    renderBox(backLink, backText, color, variant, icon) {
        return <div className="box">
            <Paper style={styles.paper_bottom_nav} elevation={1}>
                <LinkButton
                    color={color}
                    variant={variant}
                    to={backLink}
                    startIcon={BackBox.pickIcon(icon)}
                    style={styles.paper_bottom_nav_button}>
                    {backText}
                </LinkButton>
            </Paper>
        </div>;
    }

    render() {
        const {backLink, backText, renderRow, variant, color, icon} = this.props;

        let _color = color || 'secondary',
            _backLink = backLink || StatesConstants.WELCOME,
            _backText = backText || texts.default_text,
            _variant = variant || "outlined",
            _icon = icon || null;

        if (false === renderRow) {
            return this.renderBox(_backLink, _backText, _color, _variant, _icon);
        } else {
            return (
                <div className="row center-xs">
                    <div className="col-xs-12  col-sm-6  col-md-4">
                        {this.renderBox(_backLink, _backText, _color, _variant, _icon)}
                    </div>
                </div>
            );
        }
    }
}

BackBox.icon = {
    TV: 'TV',
    BACK: 'BACK',
    VOTE: 'VOTE'
};

BackBox.propTypes = {
    backLink: PropTypes.string,
    backText: PropTypes.string,
    renderRow: PropTypes.bool,
    color: PropTypes.string,
    icon: PropTypes.string
};

export default BackBox;

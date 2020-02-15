import React from 'react';

import {grey} from '@material-ui/core/colors';

const styles = {
    button: {
        display: 'inline',
        fontSize: 20,
        width: 190,
        height: 50,
        padding: 5,
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Courier New, Courier, monospace',
        borderRadius: 5,
        MozBorderRadius: 5,
        WebkitBorderRadius: 5,
        border: '2px solid #555',
        cursor: 'pointer'
    },
    color_green: {
        color: '#a6e22e'
    },
    color_purple: {
        color: '#ae81ff'
    }
};

class Strix extends React.Component {
    handleOnClick() {
        window.open("http://sarcastrix.com");
    }
    render() {
        return <a href='https://github.com/akawolv' target='_blank' style={{color: grey[500]}}>akaWolv</a>;
        return (
            <button style={styles.button} onClick={this.handleOnClick.bind(this)}>
                <span style={{lineHeight: '40px'}}>SarcaStrix.com</span>
            </button>
        );
    }
}

export default Strix;



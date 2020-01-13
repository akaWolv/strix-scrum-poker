import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router'

class Connecting extends React.Component {
    render() {
        return (
            <div style={{color: 'whitesmoke', textAlign: 'center'}}>
                <h1>One moment please!</h1>
                <br />
                Server Hamsters are getting ready...
            </div>
        );
    }
}

export default Connecting;

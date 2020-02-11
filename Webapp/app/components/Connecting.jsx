import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class Connecting extends React.Component {
    render() {
        return (
            <div style={{color: 'whitesmoke', textAlign: 'center'}}>
                <h1>One moment please!</h1>
                <br />
                Server is getting ready...
            </div>
        );
    }
}

export default Connecting;

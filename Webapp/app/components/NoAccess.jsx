import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import StatesConstants from "../constants/StatesConstants";

class Default extends React.Component {
    render() {
        return (
            <div>
                No access!<br />
                It is {(new Date()).toTimeString()}<br />
                <Link to={StatesConstants.WELCOME}>No access</Link><br />
                <h1><center>401</center></h1>
            </div>
        );
    }
}

export default Default;

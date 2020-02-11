import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue, cyan } from '@material-ui/core/colors';

import StateMachine from './controllers/StateMachine';

import '../node_modules/flexboxgrid/dist/flexboxgrid.min.css'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: lightBlue,
        secondary: cyan,
    },
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
});


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <StateMachine />
    </ThemeProvider>,
    document.getElementById('app')
);

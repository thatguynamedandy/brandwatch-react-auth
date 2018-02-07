import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class App extends Component {
  logout() {
    this.context.brandwatchAuthLogout();
  }

  render() {
    return (
      <div id="app">
        <button id="logout" onClick={ () => this.logout() }>
          Logout
        </button>
      </div>
    );
  }
}

App.contextTypes = {
  brandwatchAuthGetProfile: PropTypes.func.isRequired,
  brandwatchAuthGetToken: PropTypes.func.isRequired,
  brandwatchAuthLogout: PropTypes.func.isRequired,
};

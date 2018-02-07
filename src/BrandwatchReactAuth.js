import PropTypes from 'prop-types';
import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import TokenStore from 'donny-auth';

export default class BrandwatchReactAuth extends Component {
  getChildContext() {
    return {
      brandwatchAuthLogout: this.handleLogout,
      brandwatchAuthGetProfile: this.handleGetProfile,
      brandwatchAuthGetToken: this.handleGetToken,
    };
  }

  constructor(props) {
    super(props);
    this.store = new TokenStore(this.props.domain);
    this.handleGetProfile = this.handleGetProfile.bind(this);
    this.handleGetToken = this.handleGetToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      loggedIn: undefined,
    };

    if (props.onCreateStore) {
      props.onCreateStore(this.store);
    }
  }

  componentWillMount() {
    const { backupDomain, backupRedirect } = this.props;

    this.handleGetToken()
    .then(token => token ? this.setState(() => ({ loggedIn: true })) : Promise.reject())
    .catch(() => backupDomain ? this.handleGetToken(backupDomain) : Promise.reject())
    .then(token =>
      token && backupRedirect ? window.location.replace(backupRedirect) : Promise.reject()
    )
    .catch(e => window.location.replace(this.store.loginUrl))
  }

  handleGetProfile() {
    return this.handleGetToken().then(jwtDecode);
  }

  handleGetToken(aud = this.props.audience) {
    return this.store.getToken({ aud });
  }

  handleLogout(aud = this.props.audience) {
    return this.store.removeToken({ aud }).then(() =>
      window.location.replace(this.store.loginUrl));
  }

  render() {
    if (this.state.loggedIn === true) {
      return this.props.children;
    }
    return null;
  }
}

BrandwatchReactAuth.propTypes = {
  audience: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  backupDomain: PropTypes.string,
  backupRedirect: PropTypes.string,
  onCreateStore: PropTypes.func,
};

BrandwatchReactAuth.childContextTypes = {
  brandwatchAuthGetProfile: PropTypes.func.isRequired,
  brandwatchAuthGetToken: PropTypes.func.isRequired,
  brandwatchAuthLogout: PropTypes.func.isRequired,
};

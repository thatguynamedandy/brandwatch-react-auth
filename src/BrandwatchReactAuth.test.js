import PropTypes from 'prop-types';
import React, { Component } from 'react';
import sinon from 'sinon';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BrandwatchReactAuth from './BrandwatchReactAuth';
import {
  openDomain,
  closedDomain,
  openBackupDomain,
  closedBackupDomain,
  loginUrl,
} from './MockTokenStore';
import App from './MockApp';

function render(props, opts) {
  return mount(
    <BrandwatchReactAuth { ...props }>
      <App />
    </BrandwatchReactAuth>, opts);
}

describe('BrandwatchReactAuth', () => {
  const sandbox = sinon.sandbox.create();

  let props;
  let store;
  let opts;
  let window;

  beforeEach(() => {
    props = {
      audience: 'open.brandwatch.com',
      domain: 'open.brandwatch.com',
      onCreateStore: sandbox.stub(),
    };

    sandbox.spy(global.window.location, 'replace');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('user is correctly authenticated', () => {
    it('renders the children', () => {
      return Promise.resolve(render(props))
        .then(component => component.update() )
        .then(component => expect(component.find(App).length).toBe(1));
    });

    it('redirects them when they log out', () => {
      return Promise.resolve(render(props))
        .then(component => component.update() )
        .then(component => {
          component.find(App).find('button').simulate('click')
          return component.update();
        })
        .then(() => expect(global.window.location.replace.callCount).toBe(1));
    })
  });

  describe('user is not authenticated', () => {
    beforeEach(() => {
      props.audience = 'closed.brandwatch.com';
    });

    it('does not render the children', () => {
      return Promise.resolve(render(props))
        .then(component => component.update() )
        .then(component => expect(component.find(App).length).toBe(0));
    });

    it('redirects them to the login page', () => {
      return Promise.resolve(render(props))
        .then(component => component.update() )
        .then(component => component.update() )
        .then(component => component.update() )
        .then(() => {
          expect(global.window.location.replace.firstCall.args[0]).toBe(loginUrl);
          expect(global.window.location.replace.callCount).toBe(1)
        })
    });

    describe('user is authenticated against backup domain', () => {
      beforeEach(() => {
        props.backupDomain = 'open.backup.brandwatch.com';
        props.backupRedirect = 'https://my.brandwatch.com';
      });

      it('redirects them to the backup domain', () => {
        return Promise.resolve(render(props))
          .then(component => component.update() )
          .then(component => component.update() )
          .then(() => {
            expect(global.window.location.replace.callCount).toBe(1)
            expect(global.window.location.replace.firstCall.args[0]).toBe(props.backupRedirect);
          });
      });

      describe('but no redirect url is supplied', () => {
        beforeEach(() => {
          props.backupRedirect = null;
        });

        it('redirects them to the login page', () => {
          return Promise.resolve(render(props))
            .then(component => component.update() )
            .then(component => component.update() )
            .then(component => component.update() )
            .then(() => {
              expect(global.window.location.replace.callCount).toBe(1)
              expect(global.window.location.replace.firstCall.args[0]).toBe(loginUrl);
            });
        });
      });
    });

    describe('user is not authenticated against backup domain', () => {
      beforeEach(() => {
        props.backupDomain = 'closed.backup.brandwatch.com';
        props.backupRedirect = 'https://my.brandwatch.com';
      });

      it('redirects them to the login page', () => {
        return Promise.resolve(render(props))
          .then(component => component.update() )
          .then(component => component.update() )
          .then(component => component.update() )
          .then(() => {
            expect(global.window.location.replace.callCount).toBe(1)
            expect(global.window.location.replace.firstCall.args[0]).toBe(loginUrl);
          });
      });
    });
  });
});

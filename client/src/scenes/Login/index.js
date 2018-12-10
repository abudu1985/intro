import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import Input from './../../components/Input';
import RoundButton from './../../components/RoundButton';
import Logo from './../../components/Logo';
import Recaptcha from './../../components/Recaptcha';
import { userLoginSuccess, userLoginFail, doLogin } from '../../actions/user';

import style from './style.scss';
import {RECAPTCHA_KEY} from '../../../variables';


export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      redirectToMain: this.props.user.logged,
      captcha: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.redirectToMain) !== JSON.stringify(nextProps.user.logged)) // Check if it's a new user, you can also use some unique, like the ID
    {
      this.setState(Object.assign({}, this.state, {redirectToMain: nextProps.user.logged}));
    }
  }

  handleChange(field) {
    return (event) => this.setState({[field]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.captcha && this.props.user.showRecaptcha) {
      this.setState(Object.assign({}, this.state, {errorMessage: 'Are you a robot?'}))
    } else {
      this.props.doLogin(this.state.username, this.state.password, this.state.captcha);
      if(this.props.user.showRecaptcha){
          this.captchaInput.reset();
      }
      this.setState(Object.assign({}, this.state, {captcha: ''}));
    }
  }

  verifyCallback(captcha) {
    this.setState(Object.assign({}, this.state, {errorMessage: ''}));
    this.setState(Object.assign(this.state, {captcha}));
  }

  render() {
    if (this.state.redirectToMain) {
      return (
        <Redirect to={{pathname: '/'}} />
      );
    }
    return (
      <div className="login-container">
        <div className="content-container">
          <Logo />
          <form className="login-form" onSubmit={this.handleSubmit}>
            <Input type="text" name="login" placeholder="Username" onChange={this.handleChange('username')} required="required" />
            <Input type="password" name="password" placeholder="Password" onChange={this.handleChange('password')} required="required" />
            <RoundButton
              type='submit'
              disabled={this.props.user.fetching || this.props.user.processing}
              innerHtml="Log In"/>
          </form>
          <div className={"recaptcha-block" + ((this.props.user.fetching || this.props.user.processing) ? " recaptcha-block--pale" : "") }>
              { this.props.user.showRecaptcha ?
            <Recaptcha
              ref={e => this.captchaInput = e}
              sitekey={RECAPTCHA_KEY}
              verifyCallback={this.verifyCallback}
            /> : null }
          </div>
          {this.props.user.errorMessage || this.state.errorMessage ? <div className="error-message">{this.state.errorMessage || this.props.user.errorMessage}</div> : null}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {user:state.userInfo});
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSuccess: (admin) => {
      dispatch(userLoginSuccess(admin ? true : false))
    },
    onLoginFail: () => {
      dispatch(userLoginFail());
    },
    doLogin: (username, password, captcha) => {
      dispatch(doLogin(username, password, captcha));
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
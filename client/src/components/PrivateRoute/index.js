import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Main from '../../scenes/Main';


class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.Component = props.component;
    this.state =  {
      logged: props.logged,
      args: Object.assign({}, props, {component: null, logged: null})
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.logged !== nextProps.logged) {
      this.setState(Object.assign({}, this.state, {logged: nextProps.logged}));
    }
  } 

  render() {
    let Component = this.Component;
    return (
      <Route render={props => this.state.logged ? <Component /> : <Redirect to='/login' />}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {logged: state.userInfo.logged});
}

export default connect(
  mapStateToProps,
  null
)(PrivateRoute);
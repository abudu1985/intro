import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Logo from '../Logo';
import { searchFilter } from '../../actions';
import SettingsMenu from '../SettingsMenu';

import style from './style.scss';
import AdminBar from "../AdminBar";


const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (event) => {
      dispatch(searchFilter(event.target.value))
    }
  }
}

class RawHeader extends React.Component{
  constructor(props) {
    super(props);
    this.onChange = props.onChange;
    this.adminPage = props.adminPage;
  }

  componentDidMount(){
    if (window.innerWidth > 1000 && !this.props.adminPage) {
      this.searchInput.focus();
    }
  }

  render() {
    return (
      <header className='header'>
        <Logo />
        <div className='interactive-block'>
            { !this.props.adminPage ? <input className='page-search' onChange={this.onChange} ref={(input) => { this.searchInput = input; }} /> : null }
            <SettingsMenu/>
            {/*<a href='/api/auth/logout'><img className='logout' src='static/logout.svg'/></a>*/}
        </div>
      </header>
    );
  }
}

const Header = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RawHeader);

export default Header;

RawHeader.propTypes = {
  onChange: PropTypes.func.isRequired,
  adminPage: PropTypes.bool.isRequired,
};
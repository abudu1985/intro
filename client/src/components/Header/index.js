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
    },
    cancelSearch: (val) => {
        dispatch(searchFilter(val))
    }
  }
}

class RawHeader extends React.Component{
  constructor(props) {
    super(props);
    this.adminPage = props.adminPage;
    this.state = {
        touch: false
    };
    this.onStartChange = this.onStartChange.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
  }

  componentDidMount(){
    if (window.innerWidth > 1000 && !this.props.adminPage) {
      this.searchInput.focus();
    }
  }

  onStartChange(event) {
    console.log(event.target.value);
    if(event.target.value !== ""){
        this.setState({ touch: true});
    } else {
        this.setState({ touch: false});
    }

    this.props.onChange(event);
  }

  onClearClick() {
    this.searchInput.value = '';
    this.setState({ touch: false});
    this.props.cancelSearch(this.searchInput.value);
    console.log('hello clear');
  }

  render() {
    return (
      <header className='header'>
        <Logo />
        <div className='interactive-block'>
            { !this.props.adminPage ?
                <input className={!this.state.touch ? 'page-search' : 'page-search-delete'} onChange={this.onStartChange} ref={(input) => { this.searchInput = input; }} />
                : null
            }

            {this.state.touch ?
            <button
                type="button"
                onClick={() => this.onClearClick()}
                className="search-close-icon"
            >X</button>
                : null
            }

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
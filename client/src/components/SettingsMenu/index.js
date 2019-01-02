import React from 'react';
import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';
import { connect } from 'react-redux';
import {reactLocalStorage} from "reactjs-localstorage";
import style from './style.scss';
import {Link} from 'react-router-dom';

class SettingsMenu extends React.Component {
    constructor() {
        super();
        this.deleteAccount = this.deleteAccount.bind(this);
        this.logout = this.logout.bind(this);
        this.tryRedirectToHome = this.tryRedirectToHome.bind(this);
        this.tryRedirectToAdmin = this.tryRedirectToAdmin.bind(this);
    }

    deleteAccount(e) {
        console.log("Deleting Account")
    }

    logout(e) {
        console.log("Logging out")
    }

    tryRedirectToAdmin(e) {
        e.preventDefault();
        window.location = "/adminmanager";
        return false;
    }

    tryRedirectToHome(e) {
        e.preventDefault();
        window.location = "/";
        return false;
    }

    render() {
        return (
            <DropdownMenu position='center' triggerType='text' trigger={reactLocalStorage.get('full_name')}>
                <div>
                    <Link className="home-link" to="/">Home</Link>
                </div>
                <br/>
                <div>
                    {this.props.canEdit ? <Link to="/adminmanager">Adminmanager</Link> : null}
                </div>
                <MenuItem type='separator'/>
                <a href='/api/auth/logout'>Logout</a>
            </DropdownMenu>

        );
    }
}

function mapStateToProps (state) {
    return {
        canEdit: state.userInfo.canEdit
    }
}

const Menu = connect(mapStateToProps)(SettingsMenu);


export default Menu;
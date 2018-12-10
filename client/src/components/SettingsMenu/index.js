import React from 'react';
import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';
import { connect } from 'react-redux';
import {reactLocalStorage} from "reactjs-localstorage";
import style from './style.scss';

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
        window.location.href = "/adminmanager";
        return false;
    }

    tryRedirectToHome(e) {
        e.preventDefault();
        window.location.href = "/";
        return false;
    }

    render() {
        return (
            <DropdownMenu userName={reactLocalStorage.get('user')} position='left' triggerType='text'
                          trigger={reactLocalStorage.get('full_name')}>
                <a href="#" onClick={(e) => {return this.tryRedirectToHome(e)}}>Home</a>
                <br/><br/>
                {this.props.canEdit ? <a href="#" onClick={(e) => {return this.tryRedirectToAdmin(e)}}>Adminmanager</a> : null}
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
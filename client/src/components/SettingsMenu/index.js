import React from 'react';
import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';
import { connect } from 'react-redux';
import {reactLocalStorage} from "reactjs-localstorage";

class SettingsMenu extends React.Component {
    constructor() {
        super();
        this.deleteAccount = this.deleteAccount.bind(this);
        this.logout = this.logout.bind(this);
    }

    deleteAccount(e) {
        console.log("Deleting Account")
    }

    logout(e) {
        console.log("Logging out")
    }

    render() {
        return (
            <DropdownMenu userName={reactLocalStorage.get('user')} position='left' triggerType='text' trigger={reactLocalStorage.get('full_name')}>
                <MenuItem text="Home" location="/" />
                { this.props.canEdit ? <MenuItem text="Adminmanager" location="/adminmanager" /> : null }
                <MenuItem type='separator' />
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
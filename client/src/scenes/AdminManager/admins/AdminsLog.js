import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {reactLocalStorage} from "reactjs-localstorage";
import Moment from "moment";
import {deleteAdmin} from "../../../actions/admins";


class AdminsLog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dateString = (ut) => {
            return Moment.unix(ut/1000).format("ll");
        };

        const isDeletedAdmin = (data) => {
            if (data) { return true; }
            return false
        };

        return (
            <ul className="list-group list-group-flush">
                {this.props.admins.map(el => (
                    <li className="list-group-item" key={el.id}>
                        <div className="panel panel-default">
                            <div className="panel-body"
                                 style={ isDeletedAdmin(el.deletedBy) ? {backgroundColor: '#ffd6cc'} : {} }
                            > {el.login} {' |   added by ' + reactLocalStorage.get('user')}
                            {' |   ' + dateString(el.id)}
                            {isDeletedAdmin(el.deletedBy) ? ' |   deleted by  ' + el.deletedBy : ''}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }
}


const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        admins: state.admins
    });
}

export default connect(mapStateToProps)(AdminsLog);

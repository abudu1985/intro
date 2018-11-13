import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {deleteAdmin} from "../../../actions/admins";
import {reactLocalStorage} from "reactjs-localstorage";


class ValidAdmins extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isDeletedAdmin = (data) => {
            if (data) { return true; }
            return false
        };
        const validAdmins = this.props.admins.filter(function(el) {
            return !isDeletedAdmin(el.deletedBy);
        });

        return (
            <div>
                <h2>Admins</h2>
                <p>Available admins:</p>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="col-10">Login</th>
                        <th className="col-2">Activity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {validAdmins.map((item, i) => {
                        return [
                            <tr key={i}>
                                <td className="col-10">
                                    <b>{item.login}</b>
                                </td>
                                <td className="col-2">
                                    <button
                                        onClick={this.props.onDeleteClick.bind(this, item.id)}
                                        type="button" className="btn btn-danger btn-xs"
                                    >DELETE</button>
                                </td>
                            </tr>
                        ]
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

ValidAdmins.prototype.propTypes = {
    admins: PropTypes.array.isRequired
};

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        admins: state.admins
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: (id) => {
            dispatch(deleteAdmin(id, reactLocalStorage.get('user')))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidAdmins);

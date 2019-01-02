import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {addAdmin, deleteAdmin} from "../../../actions/admins";
import {reactLocalStorage} from "reactjs-localstorage";
import {Typeahead} from 'react-bootstrap-typeahead';


class ValidAdmins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emptyTag: false,
            users: [],
            inList: false,
            inactive: true,
            notFound: false,
            hasError: false,
            name: ''
        };
        this.onStartSelectAdminName = this.onStartSelectAdminName.bind(this);
        this.blurHandler = this.blurHandler.bind(this);
        this.onStartTypeAdminName = this.onStartTypeAdminName.bind(this);
        this.onAddAdmin = this.onAddAdmin.bind(this);
    }

    componentWillMount() {
        fetch('/api/admins/get_all_active_users', {credentials: 'include'})
            .then(response => response.json())
            .then(json => this.setState({ users: json }));
    }

    onAddAdmin() {
        if (this.state.name.trim() === "") {
            this.setState({emptyTag: true});
        } else {
            const data = {
                id: Date.now().toString(),
                login: this.state.name,
                addedBy: reactLocalStorage.get('user'),
                deletedBy: ''
            };
            this.props.addAdmin(data);
            this.setState({inactive: true});
            this.typeahead.getInstance().clear();
        }
    }

    onStartTypeAdminName(selected, usedAdmins){
        if(selected === '') {
            this.setState({emptyTag: true, inactive: true, hasError: true, notFound: false, inList: false});

        } else {
            if(this.state.users.indexOf(selected) === -1) {
                this.setState({notFound: true, inactive: true, hasError: true, emptyTag: false});
            }

            if(usedAdmins.indexOf(selected) !== -1)
            {
                this.setState({inList: true, inactive: true, hasError: true, notFound: false, emptyTag: false});
            }
        }
    }

    onStartSelectAdminName(value, usedAdmins) {

        if(usedAdmins.indexOf(value[0]) !== -1)
        {
            this.setState({inList: true, inactive: true, hasError: true, notFound: false, emptyTag: false});
        } else {
            this.setState({name: value[0], emptyTag: false, inList: false, inactive: false, hasError: false, notFound: false});
        }
    }

    blurHandler() {
        this.setState({emptyTag: false});
    }

    render() {
        const isDeletedAdmin = (data) => {
            if (data) { return true; }
            return false
        };
        const validAdmins = this.props.admins.filter(function(el) {
            return !isDeletedAdmin(el.deletedBy);
        });

        let usedAdmins = [];

        validAdmins.forEach(function (item, i, arr) {
            usedAdmins.push(arr[i].login);
        });

        return (
            <div>
                <h2>Add more admins</h2>
                <div className={this.state.hasError ? "form-group has-error" : "form-group"}>
                    <Typeahead
                        onChange={(selected) => {
                            this.onStartSelectAdminName(selected, usedAdmins);
                        }}
                        options={this.state.users}
                        placeholder="Enter Username of next admin"
                        onInputChange={(selected) => {
                            this.onStartTypeAdminName(selected, usedAdmins);
                        }}
                        ref={(typeahead) => this.typeahead = typeahead}
                        maxResults={8}
                        minLength={1}
                    />
                    {this.state.emptyTag ? <span className="help-block">Username should not be empty.</span> : ""}
                    {this.state.inList ? <span className="help-block">Username already in admin list.</span> : ""}
                    {this.state.notFound ? <span className="help-block">Username not found.</span> : ""}
                </div>
                <button type="submit" className="btn btn-primary"
                        onClick={this.onAddAdmin}
                        disabled={this.state.inactive}
                >Submit
                </button>
                <hr/>
                <h2>Admins</h2>
                <p>Available admins:</p>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="col-10">Username</th>
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
                                        onClick={this.props.onDeleteClick.bind(this, item.id, item.login)}
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

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        admins: state.admins
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: (id, login) => {
            dispatch(deleteAdmin(id, reactLocalStorage.get('user'), login))
        },

        addAdmin: (data) => {
            dispatch(addAdmin(data));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ValidAdmins);

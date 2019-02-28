import React from 'react';
import {connect} from 'react-redux';
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
      name: ''
    };
    this.blurHandler = this.blurHandler.bind(this);
    this.onStartTypeAdminName = this.onStartTypeAdminName.bind(this);
    this.onAddAdmin = this.onAddAdmin.bind(this);
  }

  onAddAdmin() {
    if (this.name.value.trim() === "") {

      this.setState({emptyTag: true});
    } else {
      const data = {
        id: Date.now().toString(),
        login: this.name.value,
        addedBy: reactLocalStorage.get('user'),
        deletedBy: ''
      };

      console.log(data);

      this.props.addAdmin(data);
      this.name.value = '';
      this.setState({inactive: true, emptyTag: false});
    }
  }

  onStartTypeAdminName(event) {
    if (event.target.value.trim() !== "") {
      this.setState({emptyTag: false, inactive: false});
    } else {
      this.setState({emptyTag: true});
    }
  }

  blurHandler() {
    this.setState({emptyTag: false});
  }

  render() {
    const isDeletedAdmin = (data) => {
      if (data) {
        return true;
      }
      return false
    };
    const validAdmins = this.props.admins.filter(function (el) {
      return !isDeletedAdmin(el.deletedBy);
    });

    let usedAdmins = [];

    validAdmins.forEach(function (item, i, arr) {
      usedAdmins.push(arr[i].login);
    });

    return (
      <div>
        <h2>Add more admins</h2>

        <div className={this.state.emptyTag ? "form-group has-error" : "form-group"}>
          <label>Admin name<span style={{'color': 'red'}}><b>*</b></span>:</label>
          <input type="text"
                 className="form-control"
                 ref={(input) => {this.name = input}}
                 placeholder="Enter admin name"
                 onChange={this.onStartTypeAdminName}
                 onBlur={this.blurHandler}
                 required
          />
          {this.state.emptyTag ? <span className="help-block">Admin name should not be empty.</span> : ""}
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
                  >DELETE
                  </button>
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

import React, { Component } from "react";
import { connect } from "react-redux";
import {reactLocalStorage} from 'reactjs-localstorage';
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";

import Header from "../../components/Header";
import List from "./admins/AdminsLog";
import {addAdmin, fetchAdmins} from "../../actions/admins";
import {Tabs, Nav, Content} from 'react-tiny-tabs';
import ValidAdmins from "./admins/ValidAdmins";
import CardCrud from "./CardCrud";
import BlockOrder from "./BlockOrder";
import {fetchCards, fetchBlocks} from '../../actions';
import BlockCrud from "./BlockCrud";
import CardOrder from "./CardOrder";
import Tags from "./tags/Tags";
import {fetchTags} from "../../actions/tags";


class AdminManager extends Component {
    constructor() {
        super();
        this.state = {
            admins: []
        };
    }

    componentWillMount() {
        this.props.updateAdminsList();
        this.props.updateTagsList();
    }

    onAddAdmin() {
        const data = {
            id: Date.now().toString(),
            login: this.adminInputValue.value,
            addedBy: reactLocalStorage.get('user'),
            deletedBy: ''
        };
        this.props.addAdmin(data);
        this.adminInputValue.value = '';
    }

    render() {
        if (!this.props.canEdit) {
            return (
                <Redirect to={{pathname: '/'}} />
            );
        }
        return (
            <div>
                <Header adminPage={true}/>
                <hr/>
                <div className="container">
                    <Tabs className="theme-default">
                        <Nav>
                            <div>Blocks</div>
                            <div>Cards</div>
                            <div>Tags</div>
                            <div>Order blocks</div>
                            <div>Order cards</div>
                            <div>Admins</div>
                            <div>Logs</div>
                        </Nav>
                        <Content>
                            <div>
                                <BlockCrud />
                            </div>
                        {/* create read update delete cards */}
                            <div>
                                <CardCrud />
                            </div>
                        {/* create tags */}
                            <div>
                                <Tags />
                            </div>
                        {/* cards block order */}
                            <div>
                                {/* here section for card block ordering */}
                                <BlockOrder />
                            </div>
                        {/* cards order */}
                            <div>
                                {/* here section for cards ordering */}
                                <CardOrder />
                            </div>
                        {/* show valid admins */}
                            <div>
                                <h2>Add more admins</h2>
                                <div className="form-group">
                                    <label>Login:</label>
                                    <input type="text" className="form-control" ref={(input) => {
                                        this.adminInputValue = input
                                    }} placeholder="Enter login of next admin"/>
                                </div>
                                <button type="submit" className="btn btn-default"
                                        onClick={this.onAddAdmin.bind(this)}>Submit
                                </button>
                                <hr/>
                                <ValidAdmins />
                            </div>
                         {/*logs*/}
                            <div>
                                <List />
                            </div>
                        </Content>
                    </Tabs>
                </div>

            </div>

        );
    }
}

AdminManager.propTypes = {
    updateAdminsList: PropTypes.func.isRequired,
    updateTagsList: PropTypes.func.isRequired
};

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        canEdit: state.userInfo.canEdit,
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        addAdmin: (data) => {
            dispatch(addAdmin(data));
        },
        updateAdminsList: () => {
            dispatch(fetchAdmins());
        },

        updateCardsList: () => {
            dispatch(fetchCards());
        },

        getBlocks: () => {
            dispatch(fetchBlocks());
        },

        updateTagsList: () => {
            dispatch(fetchTags());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminManager);
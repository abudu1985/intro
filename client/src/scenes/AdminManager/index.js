import React, { Component } from "react";
import { connect } from "react-redux";
import {reactLocalStorage} from 'reactjs-localstorage';
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";

import Header from "../../components/Header";

import {fetchAdmins} from "../../actions/admins";
import {Tabs, Nav, Content} from 'react-tiny-tabs';
import ValidAdmins from "./admins/ValidAdmins";
import CardCrud from "./CardCrud";
import BlockOrder from "./BlockOrder";
import {fetchCards, fetchBlocks} from '../../actions';
import BlockCrud from "./BlockCrud";
import CardOrder from "./CardOrder";
import {fetchQuickLinks} from "../../actions/quickLinks";
import QuickLink from "./quicklinks/QuickLink";
import LogTable from "../../components/LogTable";


class AdminManager extends Component {
    constructor() {
        super();
        this.state = {
            admins: []
        };
    }

    componentWillMount() {
        this.props.updateAdminsList();
        this.props.updateQuickLinks();
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
                            <div>Order blocks</div>
                            <div>Order cards</div>
                            <div>QuickLinks</div>
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
                        {/* quick links */}
                            <div>
                                <QuickLink />
                            </div>
                        {/* show valid admins */}
                            <div>
                                <ValidAdmins />
                            </div>
                         {/*logs*/}
                            <div>
                                <LogTable />
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
    updateQuickLinks: PropTypes.func.isRequired
};

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        canEdit: state.userInfo.canEdit,
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateAdminsList: () => {
            dispatch(fetchAdmins());
        },

        updateCardsList: () => {
            dispatch(fetchCards());
        },

        getBlocks: () => {
            dispatch(fetchBlocks());
        },

        updateQuickLinks: () => {
            dispatch(fetchQuickLinks());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminManager);
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    updateBlockCards,
    addLog, updateQuickLinksCards
} from "../../../actions";
import { Button, Modal } from 'react-bootstrap';
import {getIdsForDeleted, getNameOfAdded} from "../../../actions/common";
import QuickLinkCardsModal from "./QuickLinkCardsModal";
import QuickLinksWithCardOrder from "./QuickLinksWithCardOrder";
import style from './style.scss';


class QuickLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            requiredItem: 0,
            blockNames: [],
            confirmStatus : false,
            deleteModal: false,
            blocks: {},
            mode: '',
            displayInfoInputs: false
        };
        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.saveCardsModalDetails = this.saveCardsModalDetails.bind(this);
    }

    saveCardsModalDetails(item) {
        let deletedCards = getIdsForDeleted(item);

        let added = getNameOfAdded(item, item.add);
        let deleted = item.delete ? Object.keys(item.delete) : "";

        let add = added ? "add: " + added  + " " : "";
        let del = deleted.length !== 0 ? ", deleted: " + deleted.join() : "";

        const data = {
            quickLinkId: this.props.quickLinks[0]._id,
            deletedCardsId: deletedCards,
            addCard: item.add,
            info: add + del,
        };

        this.props.onUpdateQuickLinksCards(data);
        this.setState({ show: false});
    }

    replaceModalItem(item) {

        this.setState({
            requiredItem: item
        });
    }

    renderSwitch(param, modalData) {
        switch (param) {
            case 'cardlist':
                return <QuickLinkCardsModal
                    modal={this.state.show}
                    block={modalData}
                    saveCardsModalDetails={this.saveCardsModalDetails}
                    cards={this.props.cards}
                    status={this.state.status}
                    quickLinks={this.props.quickLinks}
                />;
            default:
                return '';
        }
    }

    render() {
        let modalData = this.state.requiredItem;
        const { displayInfoInputs } = this.state;

        let socialInputs;

        if (displayInfoInputs) {
            socialInputs = (
                <div>
                    <hr/>
                    <p>Manage Quick Links.</p>
                    <p>By default, when there are no added cards, that block will be hidden.</p>
                    <p>Otherwise, it will be showing at the top, below navbar.</p>
                    <p>Here you can add, remove, change order(by dragging cards one by one) inside QuickLinks block.</p>
                    <p>Only 5 quick links will be visible.</p>
                    <img className='info_img' src='../../../../static/Selection_025.png'/>
                    <hr/>
                </div>
            );
        }

        return (
            <div>
                <h2>QuickLinks</h2>
                {socialInputs}

                <Button
                    bsStyle="success"
                    bsSize="xs"
                    onClick={() => {
                        this.setState(prevState => ({
                            displayInfoInputs: !prevState.displayInfoInputs
                        }));
                    }}
                >
                    Info
                </Button>
                <br/>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="col-2">Name</th>
                        <th className="col-6">Description</th>
                        <th className="col-2">Activity</th>
                    </tr>
                    </thead>

                    <tbody>

                    {this.props.quickLinks.length ?
                            this.props.quickLinks.map((item, i) => {
                        return [
                            <tr key={item}>
                                <td className="col-2">
                                    <b>{item.name}</b>
                                </td>
                                <td className="col-6">
                                    <p>{item.description}</p>
                                </td>
                                <td className="col-2">
                                    <Button
                                        bsStyle="primary"
                                        bsSize="xs"
                                        onClick={() => {
                                            this.setState({show: true, mode: 'cardlist'});
                                            this.replaceModalItem(item)
                                        }}
                                    >
                                        CARD LIST
                                    </Button>
                                </td>
                            </tr>
                        ]
                    }
                    ) : ""}
                    </tbody>
                </table>

                {this.renderSwitch(this.state.mode, modalData)}

                {this.props.quickLinks.length ?
                <QuickLinksWithCardOrder
                    onEditInit={false}
                    canEdit={this.props.canEdit}
                    cards={this.props.cards.filter(c => !c.hidden)}
                    quickLinks={this.props.quickLinks}/> : "" }
            </div>
        )
    }
}

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        cards: state.cards,
        blocks: state.blocks,
        quickLinks: state.quickLinks,
        canEdit: state.userInfo.canEdit,
        edit: state.edit
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateBlockCards: (data) => {
            dispatch(updateBlockCards(data))
        },

        writeLog : (entity, initiator, action, date, info) => {
            dispatch(addLog(entity, initiator, action, date, info))
        },

        onUpdateQuickLinksCards: (data) => {
            dispatch(updateQuickLinksCards(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickLink);

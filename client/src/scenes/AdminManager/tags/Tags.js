import React from 'react';
import { connect } from 'react-redux';
import {addTag, deleteTag, tagDeleteFail} from "../../../actions/tags";
import {reactLocalStorage} from "reactjs-localstorage";
import TagDeleteConfirm from "./TagDeleteConfirm";
import { transform, isEqual, isObject } from 'lodash';
import { difference } from "../../../actions/logs";

class Tags extends React.Component {
    constructor() {
        super();
        this.state = {
            tags: [],
            show: false
        };
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    onAddTag() {
        const data = {
            id: Date.now().toString(),
            name: this.tagInputValue.value,
            addedBy: reactLocalStorage.get('user'),
            deletedBy: ''
        };

        //const oldTags = this.props.tags;

        this.props.addTag(data);
        this.tagInputValue.value = '';

        // let obj = '';
        // setTimeout(
        //     function() {
        //         obj = difference(this.props.tags, oldTags);
        //     }
        //         .bind(this),
        //     800
        // );
        //
    }

    tryDeleteTag(id) {
        fetch('/api/tags/' + id, {method: 'DELETE', credentials: 'include'})
            .then(response => {
                response.json().then((data) => {
                    console.log(data);

                    if (!data.allow) {
                        this.setState({show: true});
                        console.log(this.state);
                        this.props.tagDeleteFail();
                    } else {
                        console.log(data);
                        //this.props.updateBlock();
                        this.props.onDeleteClick(id);
                    }
                });

            });
    }

    confirmDelete() {
        this.setState({ show: false});
    }

    render() {

        const isDeletedTag = (data) => {
            if (data) { return true; }
            return false
        };
        const validTags = this.props.tags.filter(function(el) {
            return !isDeletedTag(el.deletedBy);
        });

        return (
            <div>
                <h2>Add more tags</h2>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" className="form-control" ref={(input) => {
                        this.tagInputValue = input
                    }} placeholder="Enter tag name"/>
                </div>
                <button type="submit" className="btn btn-default"
                        onClick={this.onAddTag.bind(this)}>Submit
                </button>
                <hr/>
                <h2>Tags</h2>
                <p>Available tags:</p>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="col-10">Name</th>
                        <th className="col-2">Activity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {validTags.map((item, i) => {
                        return [
                            <tr key={i}>
                                <td className="col-10">
                                    <b>{item.name}</b>
                                </td>
                                <td className="col-2">
                                    <button
                                        onClick={() => { this.tryDeleteTag(item.id)}}
                                        type="button" className="btn btn-danger btn-xs"
                                    >DELETE</button>
                                </td>
                            </tr>
                        ]
                    })}
                    </tbody>
                </table>

                <TagDeleteConfirm
                    modal={this.state.show}
                    confirmDelete={this.confirmDelete}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, original) => {
    return Object.assign({}, original, {
        tags: state.tags
    });
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteClick: (id) => {
            dispatch(deleteTag(id, reactLocalStorage.get('user')))
        },

        addTag: (data) => {
            dispatch(addTag(data));
        },

        tagDeleteFail: () => {
        dispatch(tagDeleteFail())
    }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags);

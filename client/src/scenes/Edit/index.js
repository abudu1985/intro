import React from 'react';
import { connect } from 'react-redux';

import Card from '../../components/Card';
import EditControl from '../../components/EditControl';
import RoundButton from '../../components/RoundButton';
import * as editActions from '../../actions/edit';

import style from './style.scss';


class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmation: false,
      allow: false
    };
    this.imageChangeHandler = this.imageChangeHandler.bind(this);
    this.applyEditResults = this.applyEditResults.bind(this);
  }

  valueChangeHandler(value) {
    return (event => {
      this.props.onEditChange(value, event.target.value);
    }).bind(this);
  }

  imageChangeHandler(event) {
    let reader = new FileReader();
    reader.onload = e => {
      this.props.onEditChange('pic', reader.result);
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  applyEditResults() {
    this.props.sendEdit();
  }

  tryDeleteCard(id) {
      fetch('/api/cards/try_delete/' + id, {method: 'DELETE', credentials: 'include'})
          .then(response => {
              response.json().then((data) => {
                  if (data.allow) {
                      console.log(data);
                      this.setState({allow: true});
                  }
              });

          });
  }

  render() {

    let blockNames = this.props.blocks.map(item => item.name);

    return (
      <div className="edit-screen">
        <div className="edit-menu">
          <div className="edit-main-screen">
            <div className="edit-preview">
              <h2> {this.props.cardInfo.blockName}</h2>
              <Card 
                title={this.props.cardInfo.title}
                pic={this.props.cardInfo.pic}
                description={this.props.cardInfo.description}/>
            </div>
            <EditControl
              {...this.props.cardInfo}
              blockNameOptions={blockNames}
              onTitleChange={this.valueChangeHandler('title')}
              onUrlChange={this.valueChangeHandler('url')}
              onDescriptionChange={this.valueChangeHandler('description')}
              onImageChange={this.imageChangeHandler}
              onBlockNameChange={this.valueChangeHandler('blockName')}
              onCancel={this.props.cancelEditing}
              onApply={this.applyEditResults}
              onDelete={this.props.cardInfo.id ? () => {this.setState({showConfirmation: true}); this.tryDeleteCard(this.props.cardInfo.id)} : null}/>
          </div>
            { this.state.allow ?
                <div className="edit-confirmation-screen" style={{display: this.state.showConfirmation ? null : 'none'}}>
                    <div className="edit-confirmation-menu">
                        <p className="edit-confirmation-text">Are you sure you want to delete this item?</p>
                        <div className="edit-confirmation-control">
                            <RoundButton innerHtml='Cancel' onClick={() => this.setState({showConfirmation: false})} />
                            <RoundButton innerHtml='Delete' color='red' onClick={() => {this.props.deleteCard(); this.setState({showConfirmation: false})}} />
                        </div>
                    </div>
                </div>
                :
                <div className="edit-confirmation-screen" style={{display: this.state.showConfirmation ? null : 'none'}}>
                    <div className="edit-confirmation-menu">
                        <h4 className="edit-confirmation-text">This card used in block, you can not delete it.</h4>
                        <div className="edit-confirmation-control">
                            <RoundButton innerHtml='Cancel' onClick={() => this.setState({showConfirmation: false})} />
                        </div>
                    </div>
                </div>
            }

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, original) => {
  return Object.assign({}, original, {
    cards: state.cards,
    cardInfo: state.edit,
    canEdit: state.userInfo.canEdit,
    blocks: state.blocks
  });
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelEditing: () => {
      dispatch(editActions.cardEditCancel());
    },

    deleteCard: () => {
      dispatch(editActions.deleteCard());
    },

    onEditApply: () => {
      dispatch(editActions.cardEditApply());
    },

    onEditChange: (field, value) => {
      dispatch(editActions.cardEditChange(field, value));
    },

    sendEdit: (cardInfo) => {
      dispatch(editActions.pushUpdate());
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Edit);
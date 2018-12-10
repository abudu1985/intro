import React from 'react';
import PropTypes from 'prop-types';

import Input from '../Input';
import TextArea from '../TextArea';
import Select from '../Select';
import RoundButton from '../RoundButton';

import style from './style.scss';


class EditControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: '',
      emptyTag: false
    };
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onStartTypeTag = this.onStartTypeTag.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
  }

  handleAddTag(event) {
      event.preventDefault();
      const value = this.tagInput.value;

      if(!value){
          this.setState({emptyTag: true});
      } else {
          this.props.onTagsChange({target: {value: value}});
          this.tagInput.value = '';
      }
  }

  handleInput(event) {
      this.props.onBlockNameChange(event);
  }

  handleSubmit(event) {
      event.preventDefault();
      this.props.onApply();
  }

  onStartTypeTag(event) {
      if (event.target.value.trim() !== "") {
          this.setState({emptyTag: false});
      } else {
          this.setState({emptyTag: true});
      }
  }

  blurHandler() {
      this.setState({emptyTag: false});
  }

  render() {

    return (
      <form className="edit-control" onSubmit={this.handleSubmit}>
        <label>Title: <Input type='text' defaultValue={this.props.title || ''} onChange={this.props.onTitleChange} required/></label>
        <label>URL: <Input type='url' defaultValue={this.props.url || ''} onChange={this.props.onUrlChange} required/></label>
        <label>Image: <Input type='file' accept='.svg,.png' onChange={this.props.onImageChange} required={this.props.onDelete ? false : true}/></label>
        <label>Description: <TextArea rows='3' defaultValue={this.props.description || ''} onChange={this.props.onDescriptionChange} required/></label>
          {this.props.onDelete ?
              <label> { !this.state.emptyTag ? 'Add Tag' : <span className="emptyWarn">Not empty!</span>}
                  <div className='block-name-edit'>
                    <input type='text'
                           className={this.state.emptyTag ? 'warning_border' : ''}
                           ref={ input => this.tagInput = input }
                           onChange={this.onStartTypeTag}
                           onBlur={this.blurHandler}
                    />
                    <button className="add_tag_button" onClick={this.handleAddTag}>Add tag</button>
                  </div>
              </label>
              : null}
        <div className="edit-actions">
          <RoundButton innerHtml='Cancel' onClick={this.props.onCancel}/>
          <RoundButton type='submit' innerHtml='Apply' color='green'/>
          { this.props.onDelete ? <RoundButton innerHtml='Delete' color='red' onClick={this.props.onDelete} /> : null }
        </div>
      </form>
    );
  }
}

EditControl.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  description: PropTypes.string,
  blockName: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),

  onTitleChange: PropTypes.func.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onBlockNameChange: PropTypes.func.isRequired,
  onTagsChange: PropTypes.func.isRequired
};

export default EditControl;
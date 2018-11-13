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
    this.state = {selectValue: this.props.blockName || 'createnew'};
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSelect(event) {
    this.setState({selectValue: event.target.value});
    let customEvent = new Event('input', {bubbles: true});
    if (event.target.value !== 'createnew') {
      this.blockInput.value = event.target.value;
    } else {
      this.blockInput.value = '';
    }
    this.props.onBlockNameChange({target: {value: event.target.value !== 'createnew' ? event.target.value : ''}});
  }

  handleInput(event) {
    this.props.onBlockNameChange(event);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onApply();
  }

  render() {
    let options = this.props.blockNameOptions.map(c => <option key={c}>{c}</option>);
    return (
      <form className="edit-control" onSubmit={this.handleSubmit}>
        {/*<label>Block Name:*/}
          {/*<div className='block-name-edit'>*/}
            {/*<Select defaultValue={this.state.selectValue} onChange={this.handleSelect}>*/}
              {/*/!*<option value='createnew'>Create New</option>*!/*/}
              {/*{options}*/}
            {/*</Select>*/}
            {/*<input*/}
              {/*type='text'*/}
              {/*placeholder='Block Name'*/}
              {/*disabled={(this.state.selectValue !== 'createnew') ? 'disabled' : ''}*/}
              {/*defaultValue={this.props.blockName || ''}*/}
              {/*onChange={this.handleInput}*/}
              {/*required*/}
              {/*ref={el => {this.blockInput = el;}} />*/}
          {/*</div>*/}
        {/*</label>*/}
        <label>Title: <Input type='text' defaultValue={this.props.title || ''} onChange={this.props.onTitleChange} required/></label>
        <label>URL: <Input type='url' defaultValue={this.props.url || ''} onChange={this.props.onUrlChange} required/></label>
        <label>Image: <Input type='file' accept='.svg,.png' onChange={this.props.onImageChange} required={this.props.onDelete ? false : true}/></label>
        <label>Description: <TextArea rows='3' defaultValue={this.props.description || ''} onChange={this.props.onDescriptionChange} required/></label>
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
  blockNameOptions: PropTypes.arrayOf(PropTypes.string),

  onTitleChange: PropTypes.func.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onBlockNameChange: PropTypes.func.isRequired
};

export default EditControl;
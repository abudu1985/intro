import React from 'react';

import style from './style.scss';

const footerContent = {
  'People': [
    ['HR', 'https://wiki.cogniance.com/display/COGNIANCE/People+Partners+Team'],
    ['Travel', ''],
    ['Hospitality', ''],
    ['Recruiting', 'https://wiki.cogniance.com/display/COGNIANCE/Recruiting+Team+Contacts']
  ],
  'Production': [
    ['Program Management',''],
    ['Product Management',''],
    ['Project Management',''],
    ['Engineering',''],
    ['Design','']
  ],
  'Back Office': [
    ['Admin',''],
    ['Finance',''],
    ['Accounting',''],
    ['DOP',''],
    ['IT Support','']
  ],
  'Marketing & Sales': [
    ['Leadgrinders',''],
    ['Customer Success',''],
    ['Marketing',''],
    ['Sales','']
  ]
}

class FooterBlock extends React.Component {
  constructor(props) {
    super(props);
    this.blockName = props.blockName;
    this.links = props.links;
    this.state = {
      visible: false
    }
    this.toggleVisible = this.toggleVisible.bind(this);
  }

  componentDidMount() {
      if (window.innerWidth > 800) {
          this.setState({visible: true});
      }
  }

  toggleVisible() {
    if (window.innerWidth < 800) {
      this.setState({visible: !this.state.visible});
    }
  }

  render () {
    return (
      <div className='footer-block'>
        <div className='footer-block-wrapper'>
          <h2 onClick={this.toggleVisible}>{this.blockName}</h2>
          <div className={'footer-links' + (this.state.visible ? '' : ' hidden')}>
            {this.links}
          </div>
        </div>
      </div>
    )
  }
}

const Footer = (props) => {
  let blocks = [];
  for (let blockName in footerContent) {
    let links = footerContent[blockName].map(e => <a href={e[1]} key={e[0]} target='_blank'>{e[0]}</a>);
    blocks.push(<FooterBlock blockName={blockName} links={links} key={blockName}/>)
  }
  return (
    <footer className='footer'>
      <div className='content-wrapper'>
        <div className='footer-content'>
          {blocks}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
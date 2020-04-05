import * as React from 'react';

class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  viewNode = (name) => {
    parent.postMessage({ pluginMessage: { viewNode: name } }, '*')
  }

  render() {
    const errorEntry = this.props.entries.map((entry) =>
      <div className="error-entry" key={entry.id}>
        <svg className="error-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12.988 3.756A1.5 1.5 0 0114.29 3h3.42a1.5 1.5 0 011.302.756l11.703 20.48a1.5 1.5 0 01-.054 1.576l-1.68 2.52a1.5 1.5 0 01-1.249.668H4.268a1.5 1.5 0 01-1.249-.668l-1.68-2.52a1.5 1.5 0 01-.054-1.576l11.703-20.48zM14.58 5L3.175 24.96 4.535 27h22.93l1.36-2.04L17.42 5h-2.84zm-.08 16h3v3h-3v-3zm2.48-3v-7h-1.96v7h1.96z" />
        </svg>
        <div className="error-info">
          <div className="error-name type type--pos-large-bold">{entry.name}</div>
          <div className="error-context type type--pos-medium-normal">
            <span className="error-type">Error type: {entry.type}</span> ·
            <span className="error-view" onClick={() => this.viewNode(entry.name)}> View frame</span>
          </div>
        </div>
      </div>
    )

    return (
      <div className="error-message">
        {errorEntry}
      </div>
    )
  }
}

export default ErrorMessage;

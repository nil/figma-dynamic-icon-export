/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';

type Props = {
  startMark: string;
  sizeMark: string;
  endMark: string;
};

const Settings = ({ startMark, sizeMark, endMark }: Props): JSX.Element => {
  const [markState, setMarkState] = React.useState({ startMark, sizeMark, endMark });

  const handleChange = (event): void => {
    const { name, value } = event.target;
    setMarkState({ ...markState, [name]: value });
    parent.postMessage({ pluginMessage: { settingsUpdate: { name, value } } }, '*');
  };

  const input = (label: string): JSX.Element => {
    const name = label.toLowerCase().replace(/ ([a-z])/gi, (a, b) => b.toUpperCase());

    return (
      <div className="settings-entry">
        <label className="settings-entry-label" htmlFor={name}>{label}</label>
        <input
          type="input"
          className="input settings-entry-input"
          onChange={handleChange}
          value={markState[name]}
          placeholder={label}
          name={name}
          id={name}
        />
      </div>
    );
  };

  return (
    <div className="settings panel">
      {input('Start mark')}
      {input('Size mark')}
      {input('End mark')}
    </div>
  );
};

export default Settings;

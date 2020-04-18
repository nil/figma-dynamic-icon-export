/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';

type Props = {
  start: string;
  size: string;
  end: string;
};

const Settings = ({ start, size, end }: Props): JSX.Element => {
  const [markState, setMarkState] = React.useState({ start, size, end });

  const handleChange = (event): void => {
    const { name, value } = event.target;
    setMarkState({ ...markState, [name]: value });
    parent.postMessage({ pluginMessage: { settingsUpdate: { name, value } } }, '*');
  };

  const input = (label: string): JSX.Element => {
    const name = label.toLowerCase().replace(/ .*/gi, '');

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

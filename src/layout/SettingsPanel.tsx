import * as React from 'react';
import Input from '../components/Input';
import useAppState from '../utils/appState';

const SettingsPanel = (): JSX.Element => {
  const {
    userSettings
  } = useAppState();

  const selectExample = (): string | null => {
    let finalResult;

    if (userSettings.sizeName === 'beginning') {
      finalResult = '24 / icon';
    } if (userSettings.sizeName === 'end') {
      finalResult = 'icon / 24';
    } if (userSettings.sizeName === 'appendix') {
      finalResult = 'icon-24';
    }

    return userSettings.sizeUnits ? finalResult.replace('24', '24px') : finalResult;
  };

  return (
    <div className="settings">
      <Input id="size" type="text" label="Default icon size" />
      <Input id="sizeExplicit" type="checkbox" label="Always export icons with its size" />
      <Input id="sizeUnits" type="checkbox" label="Include pixel units in icon name" />
      <Input
        id="sizeName"
        type="select"
        label="Size naming method"
        subLabel={`ex. ${selectExample()}`}
        options={[
          { text: 'Folder at the beginning', value: 'beginning' },
          { text: 'Folder at the end', value: 'end' },
          { text: 'Appendix at the end', value: 'appendix' }
        ]}
      />
    </div>
  );
};

export default SettingsPanel;

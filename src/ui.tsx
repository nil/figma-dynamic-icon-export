import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSZip from '../node_modules/jszip/dist/jszip.min';
import useAppState, { AppStateProvider } from './utils/appState';
import exportedName from './utils/exportedName';
import modeNumber from './utils/modeNumber';

import Button from './components/Button';
import InputSelect from './components/InputSelect';
import InputText from './components/InputText';

import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import './style/index.css';


const App = (): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
  const [isSizeMethodAvailable, setIsSizeMethodAvailable] = React.useState(true);

  const {
    selectedNodes,
    setSelectedNodes,
    userValues,
    setUserValues,
    userHasUpdatedSize
  } = useAppState();


  /**
   * Recive messages from code.ts
   */
  window.onmessage = async (event): Promise<void> => {
    if (!event.data.pluginMessage) { return; }

    const { pluginMessage } = event.data;
    const userSelection = pluginMessage.initialSelection || pluginMessage.updateSelection;

    // Generate exportable zip
    if (pluginMessage.exportAssets) {
      // eslint-disable-next-line consistent-return
      return new Promise(() => {
        const zip = new JSZip();

        pluginMessage.exportAssets.forEach(({ name, svg }) => {
          zip.file(`${name}.svg`, svg);
        });

        zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
          const blobURL = window.URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = blobURL;
          link.download = 'icons.zip';
          link.click();
        });
      });
    }

    // Render list of selected nodes or an empty state
    if (userSelection) {
      // Copy status to the nodes that where previously unselected
      userSelection.forEach((entry: SelectedNode, index: number) => {
        const identicalNode = selectedNodes.filter((e: SelectedNode) => e.id === entry.id)[0];

        if (identicalNode) {
          userSelection[index].status = identicalNode.status;
        }
      });

      setSelectedNodes(userSelection);

      if (userSelection.length === 0) {
        if (!userHasUpdatedSize) {
          setUserValues({ ...userValues, sizeValue: '' });
        }
      } else if (!userHasUpdatedSize) {
        setUserValues({
          ...userValues,
          sizeValue: `${modeNumber(userSelection.map((node) => node.size))}px`
        });
      }
    }
  };


  React.useEffect(() => {
    if (userValues.sizeMethod === 'not' && /,.*?\d/.test(userValues.sizeValue)) {
      setIsSizeMethodAvailable(false);
    } else {
      setIsSizeMethodAvailable(true);
    }
  });


  // Export nodes
  const createExport = (): void => {
    const exportNodes: ExportNodes = {
      nodes: selectedNodes.map((node) => node.id),
      values: userValues
    };

    parent.postMessage({
      pluginMessage: {
        exportNodes: {
          nodes: exportNodes,
          values: userValues
        }
      }
    }, '*');
  };


  // Update size value input
  const fixSizeValueInput = (event): void => {
    if (event.target.value === '') {
      setUserValues({
        ...userValues,
        sizeValue: `${modeNumber(selectedNodes.map((node) => node.size))}px`
      });
    }
  };


  // Example of exported name
  const selectExample = (): string => {
    const match = userValues.sizeValue.match(/(\d+)/);
    const size = match ? match[0] : '24';

    return exportedName('icon', size, userValues);
  };


  // Toggle dropdown status
  const toggleDropdown = (): void => {
    const size = isDropdownOpen ? -40 : 40;

    parent.postMessage({ pluginMessage: { pluginHeight: size } }, '*');
    setIsDropdownOpen(!isDropdownOpen);
  };


  /**
   * UI markup
   */
  return (
    <>
      <section className="values">
        <InputText id="sizeValue" label="Size" placeholder="auto" onBlur={fixSizeValueInput} />
        <InputSelect
          id="sizeMethod"
          className={isSizeMethodAvailable ? '' : 'error'}
          options={[
            { value: 'not', label: 'Don’t include size in icon name' },
            { value: 'beginning', label: 'Folder at the beginning' },
            { value: 'end', label: 'Folder at the end' },
            { value: 'appendix', label: 'Appendix at the end' }
          ]}
        />

        <div className="values-example">
          {`Example: ${selectExample()}.svg`}
        </div>

        <div className={`values-dropdown ${isDropdownOpen ? 'open' : ''}`}>
          <div
            className="values-dropdown-label"
            role="button"
            tabIndex={0}
            onClick={toggleDropdown}
          >
            <div className="values-dropdown-caret" />
            <div className="values-dropdown-text">Add a prefix or suffix</div>
            <div className="values-tooltip">
              <div
                className="values-tooltip-signal type--medium"
                role="button"
                tabIndex={0}
                onMouseEnter={(): void => { setIsTooltipVisible(true); }}
                onMouseLeave={(): void => { setIsTooltipVisible(false); }}
              >
                ?
              </div>
              <div className={`values-tooltip-content ${isTooltipVisible ? 'visible' : ''} type type--negative`}>
                <span className="type--bold">$n</span>
                : number
                {' '}
                <br />
                {' '}
                <span className="type--bold">$s</span>
                : size
              </div>
            </div>
          </div>
          <div className="values-dropdown-content">
            <InputText id="prefix" placeholder="Prefix" />
            <InputText id="suffix" placeholder="Suffix" />
          </div>
        </div>

      </section>
      <section className="controls">
        <Button
          text={`Export ${selectedNodes.length} icon${selectedNodes.length !== 1 ? 's' : ''}`}
          disabled={selectedNodes.length === 0 || !isSizeMethodAvailable}
          onClick={createExport}
        />
      </section>
    </>
  );
};

ReactDOM.render(<AppStateProvider><App /></AppStateProvider>, document.getElementById('plugin-ui'));

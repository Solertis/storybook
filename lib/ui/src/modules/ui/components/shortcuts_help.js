import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { polyfill } from 'react-lifecycles-compat';

import ReactModal from 'react-modal';

const Command = styled('b')(
  ({ isLast, isFirst, theme }) => {
    switch (true) {
      case isFirst && isLast: {
        return {
          borderRight: '0 none',
          borderRadius: 2,
          marginRight: 0,
        };
      }
      case isFirst: {
        return {
          borderRight: theme.mainBorder,
          borderRadius: `${theme.mainBorderRadius} 0 0 ${theme.mainBorderRadius}`,
          marginRight: 0,
        };
      }
      case isLast: {
        return {
          borderRight: '0 none',
          borderRadius: `0 ${theme.mainBorderRadius} ${theme.mainBorderRadius} 0`,
          marginRight: 9,
        };
      }
      default: {
        return {
          borderRight: '0 none',
          borderRadius: 0,
          marginRight: 9,
        };
      }
    }
  },
  ({ theme }) => ({
    padding: '2px 10px',
    backgroundColor: theme.inputFill,
    color: 'inherit',
    lineHeight: '36px',
    minWidth: 50,
    display: 'inline-block',
    textAlign: 'center',
  })
);

const Title = styled('h4')({
  marginTop: 0,
  textAlign: 'left',
  color: 'inherit',
});

const Table = styled('table')({
  borderCollapse: 'collapse',
});

const CommandDescription = styled('span')({
  fontSize: 12,
  color: 'inherit',
});

// manage two separate shortcut keys for
// 'mac' & other (windows, linux) platforms
export function getShortcuts(platform) {
  // if it is mac platform
  if (platform && platform.indexOf('mac') !== -1) {
    return [
      { name: 'Show Search Box', keys: ['⌘ ⇧ O', '⌃ ⇧ O'] },
      { name: 'Toggle Addon panel position', keys: ['⌘ ⇧ G', '⌃ ⇧ G'] },
      { name: 'Toggle Fullscreen Mode', keys: ['⌘ ⇧ F', '⌃ ⇧ F'] },
      { name: 'Toggle Stories Panel', keys: ['⌘ ⇧ X', '⌃ ⇧ X'] },
      { name: 'Toggle Addon panel', keys: ['⌘ ⇧ Z', '⌃ ⇧ Z'] },
      { name: 'Next Story', keys: ['⌘ ⇧ →', '⌃ ⇧ →'] },
      { name: 'Previous Story', keys: ['⌘ ⇧ ←', '⌃ ⇧ ←'] },
    ];
  }

  return [
    { name: 'Show Search Box', keys: ['Ctrl + Shift + O'] },
    { name: 'Toggle Addon panel position', keys: ['Ctrl + Shift + G'] },
    { name: 'Toggle Fullscreen Mode', keys: ['Ctrl + Shift + F'] },
    { name: 'Toggle Stories Panel', keys: ['Ctrl + Shift + X'] },
    { name: 'Toggle Addon panel', keys: ['Ctrl + Shift + Z'] },
    { name: 'Next Story', keys: ['Ctrl + Shift + →'] },
    { name: 'Previous Story', keys: ['Ctrl + Shift + ←'] },
  ];
}

export const Keys = ({ shortcutKeys }) => (
  <span>
    {shortcutKeys.map((key, index, arr) => (
      <Command key={key} isLast={arr.length - 1 === index} isFirst={index === 0}>
        {key}
      </Command>
    ))}
  </span>
);

Keys.propTypes = {
  shortcutKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const Shortcuts = ({ appShortcuts }) => (
  <div>
    <Title>Keyboard Shortcuts</Title>
    <Table>
      <tbody>
        {appShortcuts.map(shortcut => (
          <tr key={shortcut.name}>
            <td>
              <Keys shortcutKeys={shortcut.keys} />
            </td>
            <td>
              <CommandDescription>{shortcut.name}</CommandDescription>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

Shortcuts.propTypes = {
  appShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      keys: PropTypes.array,
    })
  ).isRequired,
};

class ShortcutsHelp extends Component {
  state = {};
  static getDerivedStateFromProps({ theme }) {
    return {
      modalClass: css({
        position: 'absolute',
        border: theme.mainBorder,
        borderRadius: theme.mainBorderRadius,
        boxSizing: 'border-box',
        padding: 32,
        top: 32,
        left: '50%',
        width: 440,
        outline: '0 none',
        marginLeft: -220,
        overflow: 'visible',
        background: theme.barFill,
        fontSize: theme.mainTextColor,
        fontFamily: theme.mainTextFace,
        color: theme.mainTextColor,
      }),
      overlayClass: css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.overlayBackground,
        zIndex: 1,
      }),
    };
  }
  render() {
    const { isOpen, onClose, platform } = this.props;
    const { overlayClass, modalClass } = this.state;

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={modalClass}
        overlayClassName={overlayClass}
        contentLabel="Shortcuts"
      >
        <Shortcuts appShortcuts={getShortcuts(platform)} />
      </ReactModal>
    );
  }
}

ShortcutsHelp.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  platform: PropTypes.string.isRequired,
};
ShortcutsHelp.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

polyfill(ShortcutsHelp);
export default withTheme(ShortcutsHelp);

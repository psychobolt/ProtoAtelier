// @flow
import React from 'react';

type Props = {
  active?: boolean,
  onClick: Function,
  children: any
};

export const XTab = ({ active, onClick, children }: Props) => (
  <x-tab
    onClick={onClick}
    toggled={active || null}
  >
    <x-label>
      {children}
    </x-label>
  </x-tab>
);

XTab.defaultProps = {
  active: false,
};

export default XTab;

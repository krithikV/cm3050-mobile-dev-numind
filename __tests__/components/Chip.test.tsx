import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../testUtils';
import { Chip } from '../../components/ui/Chip';

describe('Chip', () => {
  it('renders its label', () => {
    renderWithTheme(<Chip label="Food" />);
    expect(screen.getByText('Food')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithTheme(<Chip label="Food" onPress={onPress} />);
    fireEvent.press(screen.getByText('Food'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is pressable even without an onPress handler', () => {
    renderWithTheme(<Chip label="Food" />);
    expect(() => fireEvent.press(screen.getByText('Food'))).not.toThrow();
  });
});

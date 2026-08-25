import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../testUtils';
import { Button } from '../../components/ui/Button';

describe('Button', () => {
  it('renders its label', () => {
    renderWithTheme(<Button label="Save" onPress={() => {}} />);
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button label="Save" onPress={onPress} />);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button label="Save" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading', () => {
    const onPress = jest.fn();
    renderWithTheme(<Button label="Save" onPress={onPress} loading />);
    // The label is replaced by an ActivityIndicator while loading.
    expect(screen.queryByText('Save')).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });
});

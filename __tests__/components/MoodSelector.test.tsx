import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../testUtils';
import { MoodSelector } from '../../components/mood/MoodSelector';
import { accents } from '../../lib/theme';

describe('MoodSelector', () => {
  it('renders all five mood options', () => {
    renderWithTheme(<MoodSelector value={null} onChange={() => {}} />);
    expect(screen.getByText('Awful')).toBeTruthy();
    expect(screen.getByText('Low')).toBeTruthy();
    expect(screen.getByText('Okay')).toBeTruthy();
    expect(screen.getByText('Good')).toBeTruthy();
    expect(screen.getByText('Great')).toBeTruthy();
  });

  it('calls onChange with the score of the tapped mood', () => {
    const onChange = jest.fn();
    renderWithTheme(<MoodSelector value={null} onChange={onChange} />);
    fireEvent.press(screen.getByText('Great'));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('highlights the selected mood label with the accent color', () => {
    renderWithTheme(<MoodSelector value={4} onChange={() => {}} />);
    const label = screen.getByText('Good');
    const flatStyle = [label.props.style].flat();
    expect(flatStyle.some((s) => s?.color === accents.mood)).toBe(true);
  });
});

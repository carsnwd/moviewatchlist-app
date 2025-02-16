import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import { useIsomorphicEffect, useMediaQuery } from '@mantine/hooks';
import AppTitle from './AppTitle';

jest.mock('@mantine/hooks', () => ({
    useMediaQuery: jest.fn(),
    useIsomorphicEffect: jest.fn(),
}));

const renderWithMantineProvider = (ui: any) => {
    return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('AppTitle', () => {
    it('renders with large screen styles', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);
        renderWithMantineProvider(<AppTitle />);
        const title = screen.getByText(/movie watchlist/i);
        expect(title).toBeInTheDocument();
        expect(title).toHaveStyle('font-size: 2.5rem');
        const icon = screen.getByTestId('icon-movie');
    });

    it('renders with small screen styles', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        renderWithMantineProvider(<AppTitle />);
        const title = screen.getByText(/movie watchlist/i);
        expect(title).toBeInTheDocument();
        expect(title).toHaveStyle('font-size: 1.5rem');
        const icon = screen.getByTestId('icon-movie');
    });
});
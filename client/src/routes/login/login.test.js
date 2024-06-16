import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../lib/apiRequest', () => ({
  post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login component', () => {
  test('handles successful login', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const updateUserMock = jest.fn();

    // Mock apiRequest.post to return a successful response
    const mockApiResponse = { data: mockUser };
    require('../../lib/apiRequest').post.mockResolvedValue(mockApiResponse);

    // Mock useNavigate hook
    const navigateMock = jest.fn();

    // Render Login component within mocked AuthContext provider
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={{ currentUser: null, updateUser: updateUserMock }}>
        <Login />
      </AuthContext.Provider>
    );

    // Fill in the form inputs
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Submit the form
    fireEvent.submit(getByText('Login'));

    // Wait for the API request to complete
    await waitFor(() => {
      expect(require('../../lib/apiRequest').post).toHaveBeenCalledWith('auth/login', {
        username: 'testuser',
        password: 'password',
      });
    });

    // Check if updateUser function is called with the correct data
    expect(updateUserMock).toHaveBeenCalledWith(mockUser);
  });

  // Add more test cases for error handling, etc.
});

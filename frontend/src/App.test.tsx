// App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import utils from './utils.mjs';

// Mock the utils.loadDocuments and utils.processRoute function
jest.mock('./utils.mjs', () => {
  return {
    loadDocuments: jest.fn((setDocuments, setLoading) => {
      setLoading(false);
      setDocuments([{ _id: '1', title: 'Document 1' }, { _id: '2', title: 'Document 2' }]);
    }),
    processRoute: jest.fn(), // Mock processRoute
  };
});

describe('App Component', () => {
  beforeEach(() => {
    // Render the App component before each test
    render(<App />);
  });

  test('initially shows loading state', () => {
    // Check if loading state is true initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Assuming there's some loading text
  });

  test('displays documents after loading', async () => {
    // Wait for documents to be loaded and displayed
    expect(await screen.findByText('Document 1')).toBeInTheDocument();
    expect(await screen.findByText('Document 2')).toBeInTheDocument();
  });

  test('renders create document button when no document is selected', async () => {
    expect(await screen.findByRole('button', { name: /create document/i })).toBeInTheDocument();
  });

  test('handles document selection and shows delete button', async () => {
    const doc1 = await screen.findByText('Document 1');
    fireEvent.click(doc1); // Select the first document

    // Check if the remove button appears after selecting a document
    expect(screen.getByRole('button', { name: /remove document/i })).toBeInTheDocument();
  });

  test('creates a new document', async () => {
    window.alert = jest.fn(); // Mock alert
  
    // Ensure the mock resolved value is set correctly
    utils.processRoute.mockResolvedValueOnce({ result: { acknowledged: true } });
  
    const createButton = await screen.findByRole('button', { name: /create document/i });
    fireEvent.click(createButton); // Click to create a new document
  
    expect(window.alert).toHaveBeenCalledWith('New document is created!'); // Check alert message
    expect(utils.loadDocuments).toHaveBeenCalled(); // Check if loadDocuments is called
  });

  test('handles deletion of a document', async () => {
    const doc1 = await screen.findByText('Document 1');
    fireEvent.click(doc1); // Select the first document

    // Mock the alert function
    window.alert = jest.fn();
    utils.processRoute.mockResolvedValueOnce({}); // Mock successful deletion

    const deleteButton = screen.getByRole('button', { name: /remove document/i });
    fireEvent.click(deleteButton); // Click to delete the document

    expect(window.alert).toHaveBeenCalledWith('Document deleted successfully!'); // Check alert message
    expect(utils.processRoute).toHaveBeenCalledWith('DELETE', '/delete/1'); // Ensure delete route is called
    expect(utils.loadDocuments).toHaveBeenCalled(); // Ensure documents are reloaded after deletion
  });

  test('renders footer correctly', () => {
    expect(screen.getByText(/noah & olga/i)).toBeInTheDocument(); // Check copyright in AppFooter
  });
  
});

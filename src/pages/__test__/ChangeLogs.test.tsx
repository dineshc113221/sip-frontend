/* eslint-disable */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useGlobaldata } from '../../contexts/masterData/DataContext';
import ChangeLogs from '../ChangeLogs';

jest.mock('../styles.css', () => ({}));
jest.mock('../../components/common/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('docx-preview', () => ({
  renderAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../contexts/masterData/DataContext', () => ({
  useGlobaldata: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('ChangeLogs Component', () => {
  const mockToken = 'test-token-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (useGlobaldata as jest.Mock).mockReturnValue({ token: mockToken });
    (useParams as jest.Mock).mockReturnValue({ filename: undefined }); // Default no param
  });

  test('renders loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    render(<ChangeLogs />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    const container = document.querySelector('.doc-viewer-container');
    expect(container).toHaveStyle('display: none');
  });


  test('successfully fetches with custom filename from params', async () => {
    (useParams as jest.Mock).mockReturnValue({ filename: 'Custom_File.docx' });
    const mockBlob = new Blob(['content']);
    mockedAxios.get.mockResolvedValue({ data: mockBlob });

    render(<ChangeLogs />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('Custom_File.docx'),
        expect.any(Object)
      );
    });
  });

  test('handles API error correctly', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    render(<ChangeLogs />);
    await waitFor(() => {
      expect(screen.getByText('Unable to load document')).toBeInTheDocument();
    });

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();    
    expect(screen.getByRole('button', { name: /download file/i })).toBeInTheDocument();
  });

  test('handles empty response data correctly', async () => {
    mockedAxios.get.mockResolvedValue({ 
      data: { size: 0 }
    });

    render(<ChangeLogs />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load document')).toBeInTheDocument();
    });
  });

  test('download button functionality in error state', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Fail'));
    render(<ChangeLogs />);
    
    await waitFor(() => {
      expect(screen.getByText('Unable to load document')).toBeInTheDocument();
    });
    
    const downloadBtn = screen.getByRole('button', { name: /download file/i });
    expect(downloadBtn).toBeInTheDocument();
    
    fireEvent.click(downloadBtn);    
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();
  });

  test('does not fetch if token is missing', async () => {
    (useGlobaldata as jest.Mock).mockReturnValue({ token: null });

    render(<ChangeLogs />);

    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('initializes docx-preview with specific configuration options', async () => {
    const mockBlob = new Blob(['docx-content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    mockedAxios.get.mockResolvedValue({ data: mockBlob });

    render(<ChangeLogs />);
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const { renderAsync } = require('docx-preview');
    expect(renderAsync).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.any(HTMLDivElement),
      undefined,
      expect.objectContaining({
        className: "docx_viewer",
        inWrapper: true,
        ignoreWidth: true,
        experimental: true,
        breakPages: true,
        useBase64URL: true
      })
    );
  });

  test('opens external links in a new tab when clicked inside the document', async () => {
    const mockBlob = new Blob(['docx-content']);
    mockedAxios.get.mockResolvedValue({ data: mockBlob });

    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { container } = render(<ChangeLogs />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const viewerContainer = container.querySelector('.doc-viewer-container');
    const link = document.createElement('a');
    link.href = 'https://sip.com/readdocs/sipversionchange';
    link.textContent = 'External Link';
    viewerContainer?.appendChild(link);

    fireEvent.click(link);
    expect(windowOpenSpy).toHaveBeenCalledWith("https://sip.com/readdocs/sipversionchange", "_blank", "noopener,noreferrer");

    // Cleanup
    windowOpenSpy.mockRestore();
  });
});
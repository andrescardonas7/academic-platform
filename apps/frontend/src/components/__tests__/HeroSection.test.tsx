import { fireEvent, render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection';

// Mock para el reconocimiento de voz
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  lang: '',
  continuous: false,
  interimResults: false,
  onstart: null,
  onresult: null,
  onerror: null,
  onend: null,
};

// Mock global para SpeechRecognition
Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockSpeechRecognition),
});

describe('HeroSection', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all main elements', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    // Verificar elementos principales
    expect(screen.getByText('Campus Cartago.')).toBeInTheDocument();
    expect(screen.getByText('Busca tu futuro aquí.')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g., Psicología, Ingeniería, Medicina...')
    ).toBeInTheDocument();
    expect(screen.getByText('Descubrir')).toBeInTheDocument();
  });

  it('handles search input correctly', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(
      'e.g., Psicología, Ingeniería, Medicina...'
    );

    fireEvent.change(searchInput, { target: { value: 'Ingeniería' } });
    expect(searchInput).toHaveValue('Ingeniería');
  });

  it('calls onSearch when form is submitted', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(
      'e.g., Psicología, Ingeniería, Medicina...'
    );
    const submitButton = screen.getByText('Descubrir');

    fireEvent.change(searchInput, { target: { value: 'Medicina' } });
    fireEvent.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith('Medicina');
  });

  it('does not call onSearch with empty query', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    const submitButton = screen.getByText('Descubrir');
    fireEvent.click(submitButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('clears search input when clearTrigger changes', () => {
    const { rerender } = render(
      <HeroSection onSearch={mockOnSearch} clearTrigger={0} />
    );

    const searchInput = screen.getByPlaceholderText(
      'e.g., Psicología, Ingeniería, Medicina...'
    );

    fireEvent.change(searchInput, { target: { value: 'Test' } });
    expect(searchInput).toHaveValue('Test');

    // Cambiar clearTrigger debería limpiar el input
    rerender(<HeroSection onSearch={mockOnSearch} clearTrigger={1} />);
    expect(searchInput).toHaveValue('');
  });

  it('displays statistics correctly', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    expect(screen.getByText('27+')).toBeInTheDocument();
    expect(screen.getByText('Programas académicos')).toBeInTheDocument();
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Universidades')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Asistente IA')).toBeInTheDocument();
  });

  it('handles voice search button click', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    const voiceButton = screen.getByLabelText('Buscar por voz');
    fireEvent.click(voiceButton);

    expect(mockSpeechRecognition.start).toHaveBeenCalled();
  });

  it('handles form submission with Enter key', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(
      'e.g., Psicología, Ingeniería, Medicina...'
    );

    fireEvent.change(searchInput, { target: { value: 'Psicología' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    expect(mockOnSearch).toHaveBeenCalledWith('Psicología');
  });

  it('trims whitespace from search query', () => {
    render(<HeroSection onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(
      'e.g., Psicología, Ingeniería, Medicina...'
    );
    const submitButton = screen.getByText('Descubrir');

    fireEvent.change(searchInput, { target: { value: '  Medicina  ' } });
    fireEvent.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith('Medicina');
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const mockOnOpenChat = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with brand and navigation items', () => {
    render(<Navigation onOpenChat={mockOnOpenChat} />);

    // Verificar brand
    expect(screen.getByText('Cartago Académico')).toBeInTheDocument();
    expect(screen.getByText('Diseña tu futuro')).toBeInTheDocument();

    // Verificar navegación desktop
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Programas')).toBeInTheDocument();
    expect(screen.getByText('Instituciones')).toBeInTheDocument();
    expect(screen.getByText('Asistente IA')).toBeInTheDocument();
  });

  it('calls onOpenChat when chat button is clicked', () => {
    render(<Navigation onOpenChat={mockOnOpenChat} />);

    const chatButton = screen.getByText('Asistente IA');
    fireEvent.click(chatButton);

    expect(mockOnOpenChat).toHaveBeenCalledTimes(1);
  });

  it('toggles mobile menu correctly', () => {
    render(<Navigation onOpenChat={mockOnOpenChat} />);

    // El menú móvil no debería estar visible inicialmente
    expect(screen.queryByText('Buscar Programas')).not.toBeInTheDocument();

    // Abrir menú móvil
    const menuButton = screen.getByLabelText('Abrir menú');
    fireEvent.click(menuButton);

    // Verificar que aparecen los elementos del menú móvil
    expect(screen.getByText('Buscar Programas')).toBeInTheDocument();
    expect(screen.getByText('Ver Programas')).toBeInTheDocument();
  });

  it('closes mobile menu when chat button is clicked', () => {
    render(<Navigation onOpenChat={mockOnOpenChat} />);

    // Abrir menú móvil
    const menuButton = screen.getByLabelText('Abrir menú');
    fireEvent.click(menuButton);

    // Verificar que el menú está abierto
    expect(screen.getByText('Buscar Programas')).toBeInTheDocument();

    // Hacer click en el botón de chat del menú móvil
    const mobileChatButton = screen.getAllByText('Asistente IA')[1]; // El segundo es del menú móvil
    fireEvent.click(mobileChatButton);

    // Verificar que se llamó onOpenChat y el menú se cerró
    expect(mockOnOpenChat).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Buscar Programas')).not.toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Navigation onOpenChat={mockOnOpenChat} />);

    const buscarLink = screen.getByRole('link', { name: /buscar/i });
    const programasLink = screen.getByRole('link', { name: /programas/i });
    const institucionesLink = screen.getByRole('link', {
      name: /instituciones/i,
    });

    expect(buscarLink).toHaveAttribute('href', '#buscar');
    expect(programasLink).toHaveAttribute('href', '#programas');
    expect(institucionesLink).toHaveAttribute('href', '#instituciones');
  });

  it('works correctly without onOpenChat prop', () => {
    render(<Navigation />);

    // Debería renderizar sin errores
    expect(screen.getByText('Cartago Académico')).toBeInTheDocument();

    // El botón de chat debería estar presente pero no hacer nada al hacer click
    const chatButton = screen.getByText('Asistente IA');
    expect(() => fireEvent.click(chatButton)).not.toThrow();
  });

  it('has proper accessibility attributes', () => {
    render(<Navigation onOpenChat={mockOnOpenChat} />);

    const menuButton = screen.getByLabelText('Abrir menú');
    expect(menuButton).toHaveAttribute('aria-label', 'Abrir menú');

    // Verificar que los links tienen texto accesible
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAccessibleName();
    });
  });
});

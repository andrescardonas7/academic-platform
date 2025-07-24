// TDD - Tests for SearchForm component
import { AcademicProgram } from '@academic/shared-types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../SearchForm';

const mockPrograms: AcademicProgram[] = [
  {
    Id: '1',
    carrera: 'Ingeniería de Sistemas',
    institucion: 'Universidad Nacional',
    modalidad: 'Presencial',
    duracion_semestres: 10,
    valor_semestre: 1000000,
    clasificacion: 'Universidad',
    nivel_programa: 'Pregrado',
    enlace: 'https://example.com',
  },
  {
    Id: '2',
    carrera: 'Administración de Empresas',
    institucion: 'Universidad del Valle',
    modalidad: 'Virtual',
    duracion_semestres: 8,
    valor_semestre: 800000,
    clasificacion: 'Universidad',
    nivel_programa: 'Pregrado',
    enlace: 'https://example.com',
  },
];

describe('SearchForm', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input with placeholder', () => {
    render(
      <SearchForm
        data={mockPrograms}
        onSelect={mockOnSelect}
        placeholder='Test placeholder'
      />
    );

    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('should show suggestions when typing', async () => {
    const user = userEvent.setup();

    render(<SearchForm data={mockPrograms} onSelect={mockOnSelect} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Ingeniería');

    await waitFor(() => {
      expect(screen.getByText('Ingeniería de Sistemas')).toBeInTheDocument();
      expect(screen.getByText('Universidad Nacional')).toBeInTheDocument();
    });
  });

  it('should filter suggestions based on career name', async () => {
    const user = userEvent.setup();

    render(<SearchForm data={mockPrograms} onSelect={mockOnSelect} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Administración');

    await waitFor(() => {
      expect(
        screen.getByText('Administración de Empresas')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Ingeniería de Sistemas')
      ).not.toBeInTheDocument();
    });
  });

  it('should call onSelect when suggestion is clicked', async () => {
    const user = userEvent.setup();

    render(<SearchForm data={mockPrograms} onSelect={mockOnSelect} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Ingeniería');

    await waitFor(() => {
      expect(screen.getByText('Ingeniería de Sistemas')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Ingeniería de Sistemas'));

    expect(mockOnSelect).toHaveBeenCalledWith(mockPrograms[0]);
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();

    render(<SearchForm data={mockPrograms} onSelect={mockOnSelect} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Universidad');

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Ingeniería de Sistemas')).toBeInTheDocument();
    });

    // Navigate down and select
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(mockOnSelect).toHaveBeenCalledWith(mockPrograms[0]);
  });

  it('should show no results message when no matches found', async () => {
    const user = userEvent.setup();

    render(<SearchForm data={mockPrograms} onSelect={mockOnSelect} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Medicina');

    await waitFor(() => {
      expect(
        screen.getByText(/No se encontraron resultados/)
      ).toBeInTheDocument();
    });
  });
});

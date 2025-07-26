import { Clock, DollarSign, ExternalLink, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Tag } from './Tag';

interface Oferta {
  Id: string;
  carrera: string;
  institucion: string;
  modalidad: string;
  duracion_semestres: number;
  valor_semestre: number;
  jornada?: string;
  clasificacion?: string;
  nivel_programa?: string;
  enlace?: string;
}

interface OfertaCardProps {
  oferta: Oferta;
}

export function OfertaCard({ oferta }: OfertaCardProps) {
  return (
    <article
      className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 relative overflow-hidden"
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {oferta.carrera}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="font-medium">{oferta.institucion}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag
            icon={<Clock className="w-3 h-3" />}
            text={oferta.modalidad}
            color="blue"
          />
          <Tag
            icon={<GraduationCap className="w-3 h-3" />}
            text={`${oferta.duracion_semestres} semestres`}
            color="green"
          />
          {oferta.jornada && (
            <Tag text={oferta.jornada} color="purple" />
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Clasificación:</span>
            <span>{oferta.clasificacion}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Nivel:</span>
            <span>{oferta.nivel_programa}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xl font-bold text-green-600">
              {oferta.valor_semestre > 0
                ? `${oferta.valor_semestre.toLocaleString()}`
                : 'Valor no disponible'}
            </span>
            {oferta.valor_semestre > 0 && (
              <span className="text-sm text-gray-500">por semestre</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <a
            href={oferta.enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Oficial
          </a>
          <Link
            href={`/carrera/${oferta.Id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

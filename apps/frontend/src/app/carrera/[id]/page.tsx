'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAcademicOfferings } from '../../../utils/useAcademicOfferings';
import { useMemo } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Clock,
  GraduationCap,
  DollarSign,
  Building,
  Calendar,
  Award,
  Users,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, loading, error } = useAcademicOfferings();

  const careerId = params.id as string;

  const career = useMemo(() => {
    return data.find(item => item.Id === careerId);
  }, [data, careerId]);

  const relatedPrograms = useMemo(() => {
    if (!career) return [];
    return data.filter(item =>
      item.carrera === career.carrera && item.Id !== careerId
    );
  }, [data, career, careerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar la información
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carrera no encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            La carrera que buscas no existe o ha sido removida.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900">{career.carrera}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Career Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {career.carrera}
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">{career.institucion}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  <Clock className="w-4 h-4" />
                  {career.modalidad}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  <GraduationCap className="w-4 h-4" />
                  {career.duracion_semestres} semestres
                </span>
                {career.jornada && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    <Calendar className="w-4 h-4" />
                    {career.jornada}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Precio por semestre</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        {career.valor_semestre > 0
                          ? `$${career.valor_semestre.toLocaleString()}`
                          : 'Gratuito'}
                      </span>
                    </div>
                  </div>
                  <a
                    href={career.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver oficial
                  </a>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Información del programa</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clasificación:</span>
                      <span className="font-medium">{career.clasificacion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nivel:</span>
                      <span className="font-medium">{career.nivel_programa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modalidad:</span>
                      <span className="font-medium">{career.modalidad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duración:</span>
                      <span className="font-medium">{career.duracion_semestres} semestres</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Información de la institución</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Institución:</span>
                      <span className="font-medium">{career.institucion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">Universidad</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acreditación:</span>
                      <span className="font-medium text-green-600">Acreditada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            {relatedPrograms.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Otras opciones para {career.carrera}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Institución</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Modalidad</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Duración</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Precio</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedPrograms.slice(0, 5).map((program) => (
                        <tr key={program.Id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{program.institucion}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {program.modalidad}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {program.duracion_semestres} semestres
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-green-600">
                              {program.valor_semestre > 0
                                ? `$${program.valor_semestre.toLocaleString()}`
                                : 'Gratuito'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Link
                                href={`/carrera/${program.Id}`}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                Ver detalle
                              </Link>
                              <a
                                href={program.enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-700 text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Users className="w-4 h-4" />
                  Comparar programas
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Star className="w-4 h-4" />
                  Guardar en favoritos
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Award className="w-4 h-4" />
                  Solicitar información
                </button>
              </div>
            </div>

            {/* Similar Careers */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Carreras similares</h3>
              <div className="space-y-3">
                {data
                  .filter(item =>
                    item.carrera !== career.carrera &&
                    item.carrera.toLowerCase().includes(career.carrera.toLowerCase().split(' ')[0])
                  )
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      key={item.Id}
                      href={`/carrera/${item.Id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">
                        {item.carrera}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.institucion}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/hooks/useScopedReportData.js
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { mockTutorias } from '../mock/tutorias.js';
import { mockCanalizaciones } from '../mock/canalizaciones.js';
import { mockRiesgos } from '../mock/riesgos.js';

/**
 * Hook que:
 * 1) Aplica el alcance por ROL (coordinación / dirección ven todo,
 *    jefes de división solo su división, tutores solo sus estudiantes).
 * 2) Expone:
 *    - scopedData: { tutorias, canalizaciones, riesgos } ya filtrados por rol
 *    - getReport({ reportType, filters }): arreglo filtrado listo para mostrar / exportar
 *
 * reportType: 'tutorias' | 'canalizaciones' | 'riesgos'
 */
export function useScopedReportData() {
  const { user } = useAuth();

  // 1. Datos base ACOTADOS por rol del usuario
  const scopedData = useMemo(() => {
    if (!user) {
      return {
        tutorias: [],
        canalizaciones: [],
        riesgos: [],
      };
    }

    const role = user.role;          // COORDINACION, DIRECCION, JEFE_DIVISION, TUTOR
    const userDivision = user.division;
    const userEmail = user.email;

    let tutorias = [...mockTutorias];
    let canalizaciones = [...mockCanalizaciones];
    let riesgos = [...mockRiesgos];

    // COORDINACION / DIRECCION: ven todo
    if (role === 'JEFE_DIVISION') {
      // Solo su división
      tutorias = tutorias.filter((t) => t.division === userDivision);
      canalizaciones = canalizaciones.filter(
        (c) => c.division === userDivision
      );
      riesgos = riesgos.filter((r) => r.division === userDivision);
    } else if (role === 'TUTOR') {
      // Solo sus estudiantes
      tutorias = tutorias.filter((t) => t.tutorEmail === userEmail);
      canalizaciones = canalizaciones.filter(
        (c) => c.tutorEmail === userEmail
      );
      riesgos = riesgos.filter((r) => r.tutorEmail === userEmail);
    }

    return { tutorias, canalizaciones, riesgos };
  }, [user]);

  // 2. Filtro por tipo de reporte + filtros del formulario
  function getReport({ reportType, filters }) {
    const {
      periodo,
      division,
      estado,
      tutorEmail,
      tipoAtencion,
      tipoRiesgo,
      nivelRiesgo,
    } = filters || {};

    if (reportType === 'tutorias') {
      const base = scopedData.tutorias || [];
      return base.filter((t) => {
        const okPeriodo =
          !periodo || periodo.trim() === '' || t.periodo === periodo;
        const okDivision =
          !division || division === 'TODAS' || t.division === division;
        const okEstado =
          !estado || estado === 'TODOS' || t.estado === estado;
        const okTutor =
          !tutorEmail ||
          tutorEmail.trim() === '' ||
          t.tutorEmail === tutorEmail;

        return okPeriodo && okDivision && okEstado && okTutor;
      });
    }

    if (reportType === 'canalizaciones') {
      const base = scopedData.canalizaciones || [];
      return base.filter((c) => {
        const okPeriodo =
          !periodo || periodo.trim() === '' || c.periodo === periodo;
        const okDivision =
          !division || division === 'TODAS' || c.division === division;
        const okEstado =
          !estado || estado === 'TODOS' || c.estado === estado;
        const okTipoAtencion =
          !tipoAtencion ||
          tipoAtencion === 'TODOS' ||
          c.tipoAtencion === tipoAtencion;

        return okPeriodo && okDivision && okEstado && okTipoAtencion;
      });
    }

    if (reportType === 'riesgos') {
      const base = scopedData.riesgos || [];
      return base.filter((r) => {
        const okPeriodo =
          !periodo || periodo.trim() === '' || r.periodo === periodo;
        const okDivision =
          !division || division === 'TODAS' || r.division === division;
        const okTipoRiesgo =
          !tipoRiesgo || tipoRiesgo === 'TODOS' || r.tipoRiesgo === tipoRiesgo;
        const okNivel =
          !nivelRiesgo || nivelRiesgo === 'TODOS' || r.nivel === nivelRiesgo;
        const okEstado =
          !estado || estado === 'TODOS' || r.estado === estado;

        return okPeriodo && okDivision && okTipoRiesgo && okNivel && okEstado;
      });
    }

    // Si mandan un tipo raro, regresamos vacío para evitar errores
    return [];
  }

  // Devolvemos AMBAS cosas:
  // - scopedData para las gráficas
  // - getReport para el generador de reportes
  return { scopedData, getReport };
}

import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Login/LoginPage';
import { RecoverPasswordPage } from './pages/RecoverPassword/RecoverPasswordPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { RequireAuth } from './components/layout/RequireAuth.jsx';
import { UsersListPage } from './pages/Users/UsersListPage.jsx';
import { UserDetailPage } from './pages/Users/UserDetailPage.jsx';
import { CoordinatorDashboardPage } from './pages/Dashboard/CoordinatorDashboardPage.jsx';
import { DivisionDashboardPage } from './pages/Dashboard/DivisionDashboardPage.jsx';
import { TutorDashboardPage } from './pages/Dashboard/TutorDashboardPage.jsx';
import { DirectionDashboardPage } from './pages/Dashboard/DirectionDashboardPage.jsx';
import { TutoriasListPage } from './pages/Tutorias/TutoriasListPage.jsx';
import { TutoriaFormPage } from './pages/Tutorias/TutoriaFormPage.jsx';
import { TutoriasStudentHistoryPage } from './pages/Tutorias/TutoriasStudentHistoryPage.jsx';
import { CanalizacionesListPage } from './pages/Canalizaciones/CanalizacionesListPage.jsx';
import { CanalizacionDetailPage } from './pages/Canalizaciones/CanalizacionDetailPage.jsx';
import { RiskPanelPage } from './pages/Risk/RiskPanelPage.jsx';
import { AlertsConfigPage } from './pages/Risk/AlertsConfigPage.jsx';
import { StudentDetailPage } from './pages/Students/StudentDetailPage.jsx';
import { DocumentListPage } from './pages/Documentos/DocumentListPage.jsx';
import { DocumentDetailPage } from './pages/Documentos/DocumentDetailPage.jsx';
import ReportGeneratorPage from './pages/Reports/ReportGeneratorPage.jsx';
import StatsChartsPage from './pages/Reports/StatsChartsPage.jsx';
import ActivityLogPage from './pages/ActivityLogPage';
import StudentsManagePage from './pages/Students/StudentsManagePage.jsx';

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* A) Acceso y cuenta */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar" element={<RecoverPasswordPage />} />

        {/* Perfil protegido: cualquier usuario logueado */}
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        {/* B) Gestión de usuarios y roles: solo Coordinación por ahora */}
        <Route
          path="/usuarios"
          element={
            <RequireAuth allowedRoles={['COORDINACION']}>
              <UsersListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/usuarios/:id"
          element={
            <RequireAuth allowedRoles={['COORDINACION']}>
              <UserDetailPage />
            </RequireAuth>
          }
        />

        {/* Dashboards por rol */}
        <Route
          path="/dashboard-coordinacion"
          element={
            <RequireAuth allowedRoles={['COORDINACION']}>
              <CoordinatorDashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard-division"
          element={
            <RequireAuth allowedRoles={['JEFE_DIVISION']}>
              <DivisionDashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard-tutor"
          element={
            <RequireAuth allowedRoles={['TUTOR']}>
              <TutorDashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard-direccion"
          element={
            <RequireAuth allowedRoles={['DIRECCION']}>
              <DirectionDashboardPage />
            </RequireAuth>
          }
        />
                {/* D) Gestión de tutorías */}
        <Route
          path="/tutorias"
          element={
            <RequireAuth allowedRoles={['TUTOR', 'COORDINACION']}>
              <TutoriasListPage />
            </RequireAuth>
          }
        />

        {/* Nueva tutoría */}
        <Route
          path="/tutorias/nueva"
          element={
            <RequireAuth allowedRoles={['TUTOR', 'COORDINACION']}>
              <TutoriaFormPage mode="create" />
            </RequireAuth>
          }
        />

        {/* Ver detalle (solo lectura) */}
        <Route
          path="/tutorias/:id"
          element={
            <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR']}>
              <TutoriaFormPage mode="view" />
            </RequireAuth>
          }
        />

        <Route
          path="/tutorias/historial/:id"
          element={
            <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR']}>
              <TutoriaFormPage mode="view" />
            </RequireAuth>
          }
        />

        {/* Editar */}
        <Route
          path="/tutorias/:id/editar"
          element={
            <RequireAuth allowedRoles={['TUTOR', 'COORDINACION']}>
              <TutoriaFormPage mode="edit" />
            </RequireAuth>
          }
        />

        {/* Historial por estudiante */}
        <Route
          path="/tutorias/estudiante/:estudianteId"
          element={
            <RequireAuth allowedRoles={['TUTOR', 'COORDINACION']}>
              <TutoriasStudentHistoryPage />
            </RequireAuth>
          }
        />
                {/* E) Gestión de canalizaciones */}
        <Route
          path="/canalizaciones"
          element={
            <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR']}>
              <CanalizacionesListPage />
            </RequireAuth>
          }
        />
                {/* Crear nueva canalización */}
        <Route
          path="/canalizaciones/nueva"
          element={
            <RequireAuth allowedRoles={['COORDINACION', 'TUTOR']}>
              <CanalizacionDetailPage mode="create" />
            </RequireAuth>
          }
        />

        <Route
          path="/canalizaciones/:id"
          element={
            <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR']}>
              <CanalizacionDetailPage mode="view" />
            </RequireAuth>
          }
        />

        <Route
          path="/canalizaciones/:id/editar"
          element={
            <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR']}>
              <CanalizacionDetailPage mode="edit" />
            </RequireAuth>
          }
        />
             {/* Riesgo Estudiantes */}
          <Route
            path="/riesgos"
            element={
              <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION']}>
                <RiskPanelPage />
              </RequireAuth>
            }
          />

          <Route
            path="/alertas/configuracion"
            element={
              <RequireAuth allowedRoles={['COORDINACION']}>
                <AlertsConfigPage />
              </RequireAuth>
            }
          />

            <Route
              path="/estudiantes/:id"
              element={
                <RequireAuth roles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR']}>
                  <StudentDetailPage />
                </RequireAuth>
              }
            />
               {/* Documentos  */}
            <Route
              path="/documentos"
              element={
                <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR', 'DIRECCION']}>
                  <DocumentListPage />
                </RequireAuth>
              }
            />

            <Route
              path="/documentos/:id"
              element={
                <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR', 'DIRECCION']}>
                  <DocumentDetailPage />
                </RequireAuth>
              }
            />

              <Route
                path="/reportes"
                element={
                  <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR', 'DIRECCION']}>
                    <ReportGeneratorPage />
                  </RequireAuth>
                }
              />

              <Route
                path="/estadisticas"
                element={
                 <RequireAuth allowedRoles={['COORDINACION', 'JEFE_DIVISION', 'TUTOR', 'DIRECCION']}>
                    <StatsChartsPage />
                  </RequireAuth>
                }
              />

                <Route
                  path="/bitacora"
                  element={
                    <RequireAuth allowedRoles={['COORDINACION', 'DIRECCION']}>
                      <ActivityLogPage />
                    </RequireAuth>
                  }
                />
                <Route
                path="/gestion-estudiantes"
                element={
                  <RequireAuth allowedRoles={['COORDINACION', 'DIRECCION', 'JEFE_DIVISION']}>
                    <StudentsManagePage />
                  </RequireAuth>
                }
              />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

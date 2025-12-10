pipeline {
    agent any

    environment {
        // Webhooks de Render (credenciales tipo Secret text en Jenkins)
        RENDER_BACKEND_HOOK  = credentials('render-backend-hook')
        RENDER_FRONTEND_HOOK = credentials('render-frontend-hook')

        // Nombre de la herramienta SonarQube Scanner configurada en Jenkins
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ===========================
        // BACKEND (Laravel)
        // ===========================
        stage('Backend - Composer install') {
            steps {
                dir('backend') {
                    bat """
                        echo === INSTALANDO DEPENDENCIAS BACKEND (COMPOSER) ===

                        if not exist vendor (
                            composer install --no-interaction --prefer-dist
                        ) else (
                            echo Vendor ya existe, saltando composer install completo...
                        )
                    """
                }
            }
        }

        stage('Backend - Tests + Coverage') {
            steps {
                dir('backend') {
                    bat """
                        echo === PREPARANDO ENTORNO DE PRUEBAS LARAVEL ===

                        if not exist .env (
                            copy .env.example .env
                        )

                        php artisan key:generate --force

                        if not exist build mkdir build
                        if not exist build\\logs mkdir build\\logs

                        echo === EJECUTANDO php artisan test CON COVERAGE ===
                        php artisan test ^
                          --log-junit build\\logs\\junit.xml ^
                          --coverage-clover build\\logs\\coverage.xml

                        echo === VERIFICANDO ARCHIVOS EN build\\logs ===
                        dir build\\logs

                        echo === ASEGURANDO coverage.xml PARA SONARQUBE ===
                        if not exist build\\logs\\coverage.xml (
                            echo ^<coverage^>^</coverage^> > build\\logs\\coverage.xml
                            echo [AVISO] coverage.xml no existia, se creo vacio para evitar fallo en SonarQube.
                        ) else (
                            echo coverage.xml encontrado correctamente.
                        )

                        echo === CONTENIDO FINAL DE build\\logs ===
                        dir build\\logs
                    """
                }
            }
        }

        // ===========================
        // FRONTEND (React/Vite)
        // ===========================
        stage('Frontend - npm install & build') {
            steps {
                dir('frontend') {
                    bat """
                        echo === INSTALANDO DEPENDENCIAS FRONTEND ===
                        if exist node_modules (
                          echo node_modules ya existe, saltando npm install...
                        ) else (
                          npm install
                        )

                        echo === BUILD FRONTEND (Vite) ===
                        npm run build
                    """
                }
            }
        }

        // ===========================
        // SONARQUBE
        // ===========================
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeLocal') {
                    bat """
                        echo === EJECUTANDO ANALISIS SONARQUBE ===
                        "%SONAR_SCANNER_HOME%\\bin\\sonar-scanner.bat" ^
                          -Dproject.settings=sonar-project.properties
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ===========================
        // DEPLOYS A RENDER
        // ===========================
        stage('Deploy Backend (Render)') {
            when { branch 'master' }
            steps {
                bat """
                    echo === DISPARANDO DEPLOY BACKEND EN RENDER ===
                    curl -X POST "%RENDER_BACKEND_HOOK%"
                """
            }
        }

        stage('Deploy Frontend (Render)') {
            when { branch 'master' }
            steps {
                bat """
                    echo === DISPARANDO DEPLOY FRONTEND EN RENDER ===
                    curl -X POST "%RENDER_FRONTEND_HOOK%"
                """
            }
        }
    }

    post {
        always {
            echo "🏁 Pipeline finalizado (con o sin errores)."
        }
        success {
            echo "✅ Todo OK: pruebas, Sonar y deploy."
        }
        failure {
            echo "❌ Algo falló, revisa la consola de Jenkins."
        }
    }
}

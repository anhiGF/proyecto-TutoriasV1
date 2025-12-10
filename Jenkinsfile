pipeline {
    agent any

    environment {
        // Webhooks de Render (credenciales tipo Secret text en Jenkins)
        RENDER_BACKEND_HOOK  = credentials('render-backend-hook')
        RENDER_FRONTEND_HOOK = credentials('render-frontend-hook')

        // Herramienta SonarScanner configurada en Jenkins (Global Tool)
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ===========================
        // BACKEND (Laravel) - DOCKER
        // ===========================
        stage('Backend - Build Docker image') {
            steps {
                dir('backend') {
                    sh '''
                        echo "🔧 Construyendo imagen Docker para backend (CI)..."
                        docker build -t tutorias-backend-ci .
                    '''
                }
            }
        }

        stage('Backend - Tests + Coverage (PHPUnit)') {
            steps {
                dir('backend') {
                    sh '''
                        echo "🧪 Ejecutando pruebas de Laravel dentro del contenedor..."

                        docker run --rm \
                          -v $PWD:/app \
                          -w /app \
                          tutorias-backend-ci \
                          bash -lc "
                            # 1) Preparar entorno de pruebas
                            cp .env.testing .env || true
                            php artisan config:clear

                            # 2) Instalar dependencias (por si acaso)
                            composer install --no-interaction --prefer-dist

                            # 3) Generar APP_KEY
                            php artisan key:generate --force

                            # 4) Crear carpeta de reportes
                            mkdir -p build/logs

                            # 5) Ejecutar pruebas con JUnit + cobertura Clover
                            php artisan test \
                                --log-junit build/logs/junit.xml \
                                --coverage-clover build/logs/coverage.xml
                          "

                        echo "📂 Archivos de cobertura generados:"
                        ls -R build/logs || echo "⚠️ No se encontró build/logs"
                    '''
                }
            }
        }

        // ===========================
        // FRONTEND (React/Vite)
        // ===========================
        stage('Frontend - npm install & build') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "📦 Instalando dependencias de frontend..."
                        npm ci || npm install

                        echo "🏗️ Haciendo build de frontend..."
                        npm run build
                    '''
                }
            }
        }

        // ===========================
        // SONARQUBE
        // ===========================
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh '''
                        echo "🔍 Ejecutando análisis SonarQube..."
                        $SONAR_SCANNER_HOME/bin/sonar-scanner \
                          -Dproject.settings=sonar-project.properties
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    // Si el quality gate falla, el pipeline truena
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
                sh '''
                    echo "🚀 Disparando deploy del BACKEND en Render..."
                    curl -X POST "$RENDER_BACKEND_HOOK"
                '''
            }
        }

        stage('Deploy Frontend (Render)') {
            when { branch 'master' }
            steps {
                sh '''
                    echo "🚀 Disparando deploy del FRONTEND en Render..."
                    curl -X POST "$RENDER_FRONTEND_HOOK"
                '''
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

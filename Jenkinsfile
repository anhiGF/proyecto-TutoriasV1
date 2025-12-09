pipeline {
    agent any

    environment {
        // Hooks de Render (credenciales tipo Secret text en Jenkins)
        RENDER_BACKEND_HOOK  = credentials('render-backend-hook')
        RENDER_FRONTEND_HOOK = credentials('render-frontend-hook')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Composer install') {
            steps {
                dir('backend') {
                    bat 'composer install --no-interaction --prefer-dist'
                }
            }
        }

            stage('Backend - Pruebas') {
                steps {
                    dir('backend') {
                        bat """
                            rem === Preparar .env para las pruebas en Jenkins ===
                            if not exist .env copy .env.example .env

                            rem Generar APP_KEY solo si hace falta
                            php artisan key:generate

                            rem Crear carpetas para los reportes de PHPUnit
                            if not exist build mkdir build
                            if not exist build\\logs mkdir build\\logs

                            rem Ejecutar pruebas con reporte JUnit + cobertura Clover para SonarQube
                            rem (los -- después de test son IMPORTANTES: separan opciones de Artisan y PHPUnit)
                            php artisan test -- --log-junit=build\\logs\\junit.xml --coverage-clover=build\\logs\\coverage.xml
                        """
                    }
                }
            }


            stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQubeLocal') {
                        def scannerHome = tool 'SonarScanner'

                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }
            }
        }

  
        stage('Frontend - npm install & build') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Backend (Render)') {
            steps {
                echo "Disparando deploy del BACKEND en Render..."
                bat "curl -X POST \"%RENDER_BACKEND_HOOK%\""
            }
        }

        stage('Deploy Frontend (Render)') {
            steps {
                echo "Disparando deploy del FRONTEND en Render..."
                bat "curl -X POST \"%RENDER_FRONTEND_HOOK%\""
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado."
        }
        success {
            echo "CI/CD OK (tests + SonarQube + build + deploy a Render)."
        }
        failure {
            echo "Algo falló en la pipeline, revisa la consola."
        }
    }
}

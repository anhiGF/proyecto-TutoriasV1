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

                        rem Generar APP_KEY sólo para este workspace de Jenkins
                        php artisan key:generate

                        rem Ahora sí correr las pruebas
                        php artisan test
                    """
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

        //Deploy backend SIEMPRE que la pipeline llegue hasta aquí
        stage('Deploy Backend (Render)') {
            steps {
                echo "Disparando deploy del BACKEND en Render..."
                // Necesitas tener curl en el agente (viene con Git for Windows, por ejemplo)
                bat "curl -X POST \"%RENDER_BACKEND_HOOK%\""
            }
        }

        // Deploy frontend SIEMPRE que la pipeline llegue hasta aquí
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
            echo "CI/CD OK (tests + build + deploy a Render)."
        }
        failure {
            echo "Algo falló en la pipeline, revisa la consola."
        }
    }
}

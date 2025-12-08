pipeline {
    agent any

    environment {
        // Para que Jenkins use la instalación de Node y PHP 
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${env.PATH}"

        // Credenciales de GitHub
        // GITHUB_CRED = credentials('github-cred-id')

        // Hooks de Render: los pones en Jenkins como "secret text"
        RENDER_BACKEND_HOOK  = credentials('render-backend-hook')
        RENDER_FRONTEND_HOOK = credentials('render-frontend-hook')
    }

    options {
        // Mantener solo N ejecuciones
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                // Si necesitas credenciales explícitas:
                // git credentialsId: 'github-cred-id', url: 'https://github.com/anhiGF/proyecto-tutoriasV1.git'
            }
        }

        stage('Backend - Composer install & tests') {
            steps {
                dir('backend') {
                    sh '''
                      php --version
                      composer --version

                      composer install --no-interaction --prefer-dist
                      php artisan test
                    '''
                }
            }
        }

        stage('Frontend - npm install & build') {
            steps {
                dir('frontend') {
                    sh '''
                      node -v
                      npm -v

                      npm install
                      npm run build
                    '''
                }
            }
        }

        stage('Security checks') {
            steps {
                dir('backend') {
                    // Vulnerabilidades en dependencias PHP
                    sh 'composer audit || echo "composer audit encontró problemas (revisa reporte)"'
                }
                dir('frontend') {
                    // Vulnerabilidades en dependencias JS
                    sh 'npm audit --audit-level=high || echo "npm audit encontró problemas (revisa reporte)"'
                }
            }
        }

        stage('Deploy to Render') {
            when {
                branch 'main'
            }
            steps {
                echo "Desplegando backend y frontend a Render..."

                // Llamar deploy hooks de Render
                sh '''
                  echo "Llamando hook backend..."
                  curl -X POST "$RENDER_BACKEND_HOOK" || echo "Warning: fallo hook backend"

                  echo "Llamando hook frontend..."
                  curl -X POST "$RENDER_FRONTEND_HOOK" || echo "Warning: fallo hook frontend"
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline OK"
        }
        failure {
            echo "Pipeline FAILED  – revisa el stage donde tronó."
        }
    }
}

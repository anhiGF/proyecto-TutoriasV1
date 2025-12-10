pipeline {
    agent any

    environment {
        // Hooks de Render
        RENDER_BACKEND_HOOK  = credentials('render-backend-hook')
        RENDER_FRONTEND_HOOK = credentials('render-frontend-hook')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // =======================
        // BACKEND: DOCKER BUILD
        // =======================
        stage('Backend - Build Docker image') {
            steps {
                dir('backend') {
                    // Construye la imagen usando TU Dockerfile
                    bat 'docker build -t tutorias-backend-ci .'
                }
            }
        }

        // =======================
        // BACKEND: TESTS EN DOCKER
        // =======================
        stage('Backend - Tests in Docker') {
            steps {
                // Ejecutamos php artisan test DENTRO del contenedor
                bat '''
                    docker run --rm ^
                      -e APP_ENV=testing ^
                      tutorias-backend-ci php artisan test
                '''
            }
        }

        // =======================
        // FRONTEND
        // =======================
        stage('Frontend - npm install & build') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        // =======================
        // DEPLOY BACKEND (RENDER)
        // =======================
        stage('Deploy Backend (Render)') {
            when {
                branch 'master'
            }
            steps {
                echo "Disparando deploy del BACKEND en Render..."
                bat "curl -X POST \"%RENDER_BACKEND_HOOK%\""
            }
        }

        // =======================
        // DEPLOY FRONTEND (RENDER)
        // =======================
        stage('Deploy Frontend (Render)') {
            when {
                branch 'master'
            }
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
            echo "I/CD OK (tests en Docker + build + deploy a Render)."
        }
        failure {
            echo "Algo falló en la pipeline, revisa la consola."
        }
    }
}

pipeline {
    agent any

    environment {
        // Replace 'yourdockerhubusername' with your actual username
        DOCKER_IMAGE = "akashnavani/interview-ai-backend"
        DOCKER_TAG = "${env.BUILD_ID}"
        SONAR_PROJECT_KEY = "interview-ai-yt"
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Code Quality Analysis (SonarQube)') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner'
            }
            steps {
                withSonarQubeEnv('SonarCloud') {
                    bat "\"${SCANNER_HOME}\\bin\\sonar-scanner.bat\" -Dsonar.projectKey=Akashnavani_InterviewAI -Dsonar.organization=akashnavani -Dsonar.sources=Backend"
                }
            }
        }

        stage('3. Dependency Scan (Trivy FS)') {
            steps {
                // Scan the local file system for dependencies/vulnerabilities
                bat 'C:\\trivy\\trivy.exe fs --format table -o trivy-fs-report.txt .'
                archiveArtifacts artifacts: 'trivy-fs-report.txt', allowEmptyArchive: true
            }
        }

        stage('4. Build Docker Image') {
            steps {
                script {
                    appImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "-f Dockerfile .")
                }
            }
        }

        stage('Vulnerability Scan (Trivy Image)') {
            steps {
                // Scan the generated Docker image
                bat "C:\\trivy\\trivy.exe image --severity HIGH,CRITICAL --format table -o trivy-image-report.txt ${DOCKER_IMAGE}:${DOCKER_TAG}"
                archiveArtifacts artifacts: 'trivy-image-report.txt', allowEmptyArchive: true
            }
        }

        stage('5. Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        appImage.push()
                        appImage.push("latest")
                    }
                }
            }
        }

        stage('6. Deploy to Render') {
            steps {
                withCredentials([string(credentialsId: 'render-deploy-hook', variable: 'RENDER_HOOK')]) {
                    // Trigger deployment on Render using the deploy hook URL
                    bat "curl -X POST ${RENDER_HOOK}"
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}

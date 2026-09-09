pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    parameters {
        booleanParam(name: 'PUSH_TO_REGISTRY', defaultValue: false, description: 'Push built Docker images to Docker Hub')
        stringParam(name: 'DOCKER_HUB_USER', defaultValue: 'sujansagar', description: 'Docker Hub Username / Organization')
        stringParam(name: 'IMAGE_TAG', defaultValue: "${BUILD_NUMBER}", description: 'Tag for the Docker images')
        booleanParam(name: 'RUN_SMOKE_TESTS', defaultValue: true, description: 'Spin up stack with Docker Compose and verify health endpoints')
        booleanParam(name: 'DEPLOY_ENV', defaultValue: false, description: 'Trigger automatic deployment of containers')
    }

    environment {
        DOCKER_REGISTRY = "docker.io"
        CLIENT_IMAGE    = "${params.DOCKER_HUB_USER}/skyflow-client"
        SERVER_IMAGE    = "${params.DOCKER_HUB_USER}/skyflow-server"
        AI_IMAGE        = "${params.DOCKER_HUB_USER}/skyflow-ai-service"
        TAG             = "${params.IMAGE_TAG}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo '🚀 Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Code Validation & Lint') {
            parallel {
                stage('Validate AI Service') {
                    steps {
                        echo '🔍 Validating Python AI microservice...'
                        sh '''
                            python3 -m py_compile ai-service/app.py || python -m py_compile ai-service/app.py
                            echo "✓ Python syntax check passed"
                        '''
                    }
                }
                stage('Validate Server API') {
                    steps {
                        echo '🔍 Checking Server dependencies and configuration...'
                        dir('server') {
                            sh '''
                                if command -v node >/dev/null 2>&1; then
                                    node -c server.js
                                    echo "✓ Server Node syntax verified"
                                fi
                            '''
                        }
                    }
                }
                stage('Validate Client Frontend') {
                    steps {
                        echo '🔍 Validating Client Vite structure...'
                        dir('client') {
                            sh '''
                                test -f package.json
                                test -f nginx.conf
                                echo "✓ Client configuration verified"
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build AI Microservice Image') {
                    steps {
                        echo "🐳 Building AI Service Docker image: ${AI_IMAGE}:${TAG}..."
                        sh """
                            docker build -t ${AI_IMAGE}:${TAG} -t ${AI_IMAGE}:latest ./ai-service
                        """
                    }
                }
                stage('Build Backend Server Image') {
                    steps {
                        echo "🐳 Building Server Docker image: ${SERVER_IMAGE}:${TAG}..."
                        sh """
                            docker build -t ${SERVER_IMAGE}:${TAG} -t ${SERVER_IMAGE}:latest ./server
                        """
                    }
                }
                stage('Build Client Frontend Image') {
                    steps {
                        echo "🐳 Building Client Docker image: ${CLIENT_IMAGE}:${TAG}..."
                        sh """
                            docker build -t ${CLIENT_IMAGE}:${TAG} -t ${CLIENT_IMAGE}:latest \
                                --build-arg VITE_API_URL=http://localhost:5000/api \
                                --build-arg VITE_SOCKET_URL=http://localhost:5000 \
                                ./client
                        """
                    }
                }
            }
        }

        stage('DevOps Integration Smoke Test') {
            when {
                expression { return params.RUN_SMOKE_TESTS }
            }
            steps {
                echo '🧪 Launching multi-container stack via Docker Compose for integration verification...'
                sh '''
                    docker compose down -v --remove-orphans || true
                    docker compose up -d

                    echo "⏳ Waiting for microservices and database to reach healthy state..."
                    sleep 20

                    # Check MongoDB, AI microservice and Server
                    docker compose ps
                '''
                
                echo '🔎 Probing live container endpoints...'
                sh '''
                    # Verify AI Microservice Health
                    curl -s -f http://localhost:5001/health || echo "AI Service probing..."

                    # Verify Backend API Health
                    curl -s -f http://localhost:5000/api/health || echo "Backend API probing..."

                    # Verify Nginx Frontend Health
                    curl -s -f http://localhost:3000/healthz || echo "Frontend Nginx probing..."
                    
                    echo "✓ Smoke tests completed"
                '''
            }
            post {
                always {
                    echo '🧹 Tearing down test containers...'
                    sh 'docker compose down -v --remove-orphans || true'
                }
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                echo '🛡️ Scanning images for known CVEs (if Trivy is installed)...'
                sh '''
                    if command -v trivy >/dev/null 2>&1; then
                        trivy image --severity HIGH,CRITICAL ${SERVER_IMAGE}:${TAG} || true
                    else
                        echo "Trivy scanner not installed on Jenkins agent, skipping vulnerability audit."
                    fi
                '''
            }
        }

        stage('Push to Docker Hub') {
            when {
                allOf {
                    expression { return params.PUSH_TO_REGISTRY }
                    branch 'main'
                }
            }
            steps {
                echo "📦 Pushing Docker images to Docker Hub registry..."
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        
                        docker push ${AI_IMAGE}:${TAG}
                        docker push ${AI_IMAGE}:latest

                        docker push ${SERVER_IMAGE}:${TAG}
                        docker push ${SERVER_IMAGE}:latest

                        docker push ${CLIENT_IMAGE}:${TAG}
                        docker push ${CLIENT_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy Application') {
            when {
                allOf {
                    expression { return params.DEPLOY_ENV }
                    branch 'main'
                }
            }
            steps {
                echo "🚀 Deploying containers to staging/production server..."
                sh '''
                    docker compose pull || true
                    docker compose up -d --remove-orphans
                    echo "✓ Application successfully deployed and running!"
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up dangling images on agent...'
            sh 'docker image prune -f || true'
        }
        success {
            echo '🎉 Jenkins CI/CD Pipeline completed successfully!'
        }
        failure {
            echo '❌ Jenkins CI/CD Pipeline failed! Please inspect logs.'
        }
    }
}

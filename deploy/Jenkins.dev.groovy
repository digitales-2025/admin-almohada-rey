pipeline {
    agent any
    environment {
        //
        // Build config
        //
        PROJECT_NAME = "almohada"
        PROJECT_SERVICE = "frontend"
        PROJECT_STAGE = "develop"
        PROJECT_TRIPLET = "${PROJECT_NAME}-${PROJECT_SERVICE}-${PROJECT_STAGE}"

        //
        // VPS setup
        //
        REMOTE_USER = "fernando"
        REMOTE_IP = credentials("fernando-hetzner-hel-01-ip")
        REMOTE_FOLDER = "/home/fernando/services/acide/almohada/"

        //
        // Docker registry setup
        //
        REGISTRY_CREDENTIALS = "dockerhub-digitalesacide-credentials"
        REGISTRY_URL = "docker.io"
        REGISTRY_USER = "digitalesacide"
        REGISTRY_REPO = "${PROJECT_TRIPLET}"
        FULL_REGISTRY_URL = "${REGISTRY_URL}/${REGISTRY_USER}/${REGISTRY_REPO}"
        ESCAPED_REGISTRY_URL = "${REGISTRY_URL}\\/${REGISTRY_USER}\\/${REGISTRY_REPO}"

        // SSH command
        SSH_COM = "ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP}"
        SSH_CRED = "hetzner-helsink-01"

        // Docker build variables
        NEXT_PUBLIC_BACKEND_URL = "https://almohada-backend-develop.araozu.dev/v1"
        INTERNAL_BACKEND_URL = "http://almohada-backend-develop:4000/v1"
        NEXT_PUBLIC_IMAGE_DOMAIN="pub-0974deb2e04246f0ba3e7ab7bad64223.r2.dev"
    }

    stages {
        stage("Build & push image") {
            steps {
                script {
                    withDockerRegistry(credentialsId: "${REGISTRY_CREDENTIALS}") {
                        def image = docker.build("${FULL_REGISTRY_URL}:${BUILD_NUMBER}", "--build-arg NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL} --build-arg INTERNAL_BACKEND_URL=${INTERNAL_BACKEND_URL} --build-arg NEXT_PUBLIC_IMAGE_DOMAIN=${NEXT_PUBLIC_IMAGE_DOMAIN} -f deploy/Dockerfile.dev .")
                        image.push()
                        image.push("latest")
                    }
                }
            }
        }
        stage("Restart frontend service") {
            steps {
                script {
                    def config = readYaml file: 'deploy/env.yaml'
                    def env = config.develop.frontend

                    def nonSensitiveVars = env.nonsensitive.collect { k, v -> "${k}=${v}" }
                    def sensitiveVars = env.sensitive

                    def credentialsList = sensitiveVars.collect { 
                        string(credentialsId: it, variable: it)
                    }

                    withCredentials(credentialsList) {
                        sshagent([SSH_CRED]) {
                            // Create a temporary script that will create the .env file
                            // This enables us to use shell variables to properly handle 
                            // the credentials without using binding.getVariable()
                            sh """
                                cat > ${WORKSPACE}/create_env.sh << 'EOL'
#!/bin/bash
cat << EOF
# Non-sensitive variables
ALMOHADA_FRONTEND_VERSION=${BUILD_NUMBER}
${nonSensitiveVars.join('\n')}
# Sensitive variables
${sensitiveVars.collect { varName -> "${varName}=\${${varName}}" }.join('\n')}
EOF
EOL
                                chmod +x ${WORKSPACE}/create_env.sh
                            """

                            // Execute the script to generate env content and send it to remote
                            sh """
                                ${WORKSPACE}/create_env.sh | ${SSH_COM} 'umask 077 && cat > ${REMOTE_FOLDER}/.env.frontend'
                            """

                            // populate & restart
                            sh """
                                ${SSH_COM} 'cd ${REMOTE_FOLDER} && \
                                docker pull ${FULL_REGISTRY_URL}:${BUILD_NUMBER} && \
                                (rm .env || true) && \
                                touch .env.base && \
                                touch .env.backend && \
                                touch .env.frontend && \
                                cat .env.base >> .env && \
                                cat .env.backend >> .env && \
                                cat .env.frontend >> .env && \
                                docker compose up -d'
                            """
                        }
                    }
                }
            }
        }
    }
}

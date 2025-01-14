// Define an empty map for storing remote SSH connection parameters
def remote = [:]

pipeline {

    agent any

    environment {
        user = credentials('aclimate_nicaragua_user')
        host = credentials('aclimate_nicaragua_host')
        name = credentials('aclimate_nicaragua_name')
        ssh_key = credentials('aclimate_nicaragua_devops')
    }

    stages {
        stage('Ssh to connect Herschel server') {
            steps {
                script {
                    try {
                        // Set up remote SSH connection parameters
                        remote.allowAnyHosts = true
                        remote.identityFile = ssh_key
                        remote.user = user
                        remote.name = name
                        remote.host = host

                        // Test SSH connection
                        sshCommand remote: remote, command: "echo 'Connection successful!'"
                    } catch (Exception e) {
                        // Capture and handle SSH connection errors
                        echo "SSH Connection Error: ${e.message}"
                        error("Failed to establish SSH connection: ${e.message}")
                    }
                }
            }
        }
        stage('Download latest release') {
            steps {
                script {
                    try {
                        sshCommand remote: remote, command: """
                            cd /var/www/docs/aclimate_nicaragua/
                            rm -fr aclimate_nicaragua_backup_\$(date +"%Y%m%d")
                            mkdir aclimate_nicaragua_backup_\$(date +"%Y%m%d")
                            cp -r /var/www/docs/aclimate_nicaragua/susano/* aclimate_nicaragua_backup_\$(date +"%Y%m%d")
                            rm -fr react-build.zip
                            curl -LOk https://github.com/CIAT-DAPA/aclimate_susano/releases/latest/download/react-build.zip
                            unzip -o react-build.zip
                            rm -fr react-build.zip
                            cp -r src/build/* /var/www/docs/aclimate_nicaragua/susano/
                            rm -fr src
                        """
                    } catch (Exception e) {
                        // Capture and handle errors during the download/deployment stage
                        echo "Deployment Error: ${e.message}"
                        error("An error occurred during deployment: ${e.message}")
                    }
                }
            }
        }
    }

    post {
        failure {
            script {
                echo "Pipeline failed"
            }
        }

        success {
            script {
                echo 'Everything went very well!!'
            }
        }
    }

}

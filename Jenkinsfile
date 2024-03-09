pipeline {
    agent { 
        node {label 'jslavepapp1'} 
    } 

    environment {
        APP_NAME = 'smartdash'
        IMAGE_NAME = 'tsel/smartdash-app'
        IMAGE_TAG = 'latest'
        ARTIFACTORY_USER = 'kharismaani'
        ARTIFACTORY_PASSWORD = credentials('smartdash-artifactory-password')
        REPOSITORY_URL = 'https://cicd-gitlab.telkomsel.co.id/smartdashboard/smartdash-app.git'
        REPOSITORY_BRANCH = 'main'
    }

    stages {
        stage ('Start') {
            steps {
                echo 'Starting pipeline SmartDash APP'
            }
        }

        stage ('SCM') {       
            steps { 
                git ( 
                    url: "${REPOSITORY_URL}", 
                    branch: "${REPOSITORY_BRANCH}", 
                    credentialsId: "jenkinsuser" 
                ) 
            } 
        }

        stage ('Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG -f prod.dockerfile .'
            }
        }

        stage ('Login') {
            steps {
                sh 'echo $ARTIFACTORY_PASSWORD | docker login --username=$ARTIFACTORY_USER --password-stdin docker.cicd-jfrog.telkomsel.co.id'
            }
        }

        stage ('Push to Artifactory') {
            steps {
                sh '''
                    docker tag $IMAGE_NAME:$IMAGE_TAG docker.cicd-jfrog.telkomsel.co.id/$APP_NAME/app
                    docker push docker.cicd-jfrog.telkomsel.co.id/$APP_NAME/app
                '''
            }
        }
    }
}
pipeline {
	agent {
		docker {
			image 'guergeiro/pnpm:22-10-alpine'
			reuseNode true
			args '-u 0:0 -v /home/jenkinsci/pnpm-store:/root/.pnpm-store'
		}
	}
	environment {
		NEXT_PUBLIC_IMAGE_DOMAIN="http://example.com"
	}
	stages {
		stage('Install dependencies') {
			steps {
				sh 'pnpm config set store-dir /root/.pnpm-store'
				sh 'pnpm i --frozen-lockfile'
			}
		}
		stage('Build Nextjs project') {
			steps {
				sh 'pnpm run check'
				sh 'pnpm run build'
			}
		}
	}
	post {
		always {
			sh 'rm -rf node_modules'
		}
	}
}

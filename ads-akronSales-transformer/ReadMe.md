**NOTE:**
It is lambda layer. All the third party libraries and custom libraries are kept under this folder.

Installing the AWS SAM CLI on Windows

Follow these steps to install and configure the prerequisites for using the AWS SAM command line interface (CLI) on your Windows host:

1) Create an AWS Identity and Access Management (AWS) account.

2) Configure IAM permissions and AWS credentials.

3) Install Docker. Note: Docker is a prerequisite only for testing your application locally or using the --use-container option.

4) Install the AWS SAM CLI.


**Step 1: Create an AWS account**

If you don't already have an AWS account, see aws.amazon.com and choose Create an AWS Account. For detailed instructions, see Create and Activate an AWS Account.

**Step 2: Configure IAM permissions and AWS credentials**

The IAM user that you use with AWS SAM must have sufficient permissions to make necessary AWS service calls and manage AWS resources. The simplest way to ensure that a user has sufficient permissions is to grant administrator privileges to them. For more information, see Creating your first IAM admin user and group in the IAM User Guide.

**Step 3: Install Docker (optional)**

Note
Docker is a prerequisite only for testing your application locally and for building deployment packages using the --use-container option. If you don't plan to use these features initially, you can skip this section or install Docker at a later time.

Docker is an application that runs containers on your Linux machines. AWS SAM provides a local environment that's similar to AWS Lambda to use as a Docker container. You can use this container to build, test, and debug your serverless applications.

To run serverless projects and functions locally with the AWS SAM CLI, you must have Docker installed and working. The AWS SAM CLI uses the DOCKER_HOST environment variable to contact the Docker daemon. The following steps describe how to install, configure, and verify a Docker installation to work with the AWS SAM CLI.

Install Docker.

Docker Desktop supports the most recent Windows operating system. For legacy versions of Windows, the Docker Toolbox is available. Choose your version of Windows for the correct Docker installation steps:

To install Docker for Windows 10, see Install Docker Desktop for Windows.

To install Docker for older versions of Windows, see Install Docker Toolbox on Windows.

Configure your shared drives.

The AWS SAM CLI requires that the project directory, or any parent directory, is listed in a shared drive. In some cases you must share your drive in order for Docker to function properly.

If you're using Windows 10 in Hyper-V mode, see Docker File Sharing.

To share drives on older versions of Windows, see Add Shared Directories.

Verify the installation.

After Docker is installed, verify that it's working. Also confirm that you can run Docker commands from the command line (for example, docker ps). You don't need to install, fetch, or pull any containers—the AWS SAM CLI does this automatically as required.

**Step 4: Install the AWS SAM CLI**

Windows Installer (MSI) files are the package installer files for the Windows operating system.

Follow these steps to install the AWS SAM CLI using the MSI file.

Install the AWS SAM CLI 64-bit.

Note
If you operate on 32-bit system, see Installing AWS SAM CLI on 32-bit Windows.

Verify the installation.

After completing the installation, verify it by opening a new command prompt or PowerShell prompt. You should be able to invoke sam from the command line.

**sam --version**

You should see output like the following after successful installation of the AWS SAM CLI:

 
**** SAM CLI, version 1.35.0**               
Install Git.

To download sample applications using the sam init command, you must also install Git. For instructions, see Installing Git.

You're now ready to start development.

**Following command to run lambda function locally**

1) npm install (run when your doing the setup first time, dont run all times)
2) npm run compile
3) sam local start-api

**output:**
http://127.0.0.1:3000/{{path}}

Use postman or api tools to test this url



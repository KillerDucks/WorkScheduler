# WorkScheduler
A scheduler for jobs

## Intro
If you have a lot of thing to do or have friends, family, strangers, etc that ask you to do something it can be hard to keep track of what you need to do and which task/job to complete first or which job has the shortest time-frame, so you will need a way to weight each job so everything can be completed in the correct order. This system will also prevent you from be overworked as it prevents jobs from being submitted if its requirements prevent you from completing current jobs thus preventing you from rushing jobs and being over worked.

I can schedule jobs in priority order in addition to any custom weighting you want to use.
Clients/Users can request jobs using the web ui or using a bot that's connected to social media or any other platform (this feature will be added after the initial app is created).

## Deployment
There are 3 models of deployment:
+ Docker
+ AIO Installer for a VM
+ Self Hosted

### Docker
There are 2 ways to deploy the software using `Docker`, the first is to use the **DockerFile** which is located in the root of the project, using this file you can configure the docker image however, this is an unsupported configuration so support may be limited in contrast, the file is kept the same and you build the image as intended this will make the deployment a supported configuration. Below is how to build the image on your system.
```sh
docker build -t "WorkScheduler:SelfBuild" .
```

The second way to deploy the system using `Docker` is to use the `docker pull` command and pull the image from the docker public registry. Below is how to do this on your system.
```sh
docker pull "WorkScheduler"
```


### AIO Installer
The AIO installer can be used as the self hosted option but this script assumes that the VM is running `Debian` minimal edition and only installed the needed components, this means its not usable in `Windows` however it might work under `WSL` but is an unsupported configuration so help maybe be available but not the intended way to use/setup this system.

Below is the way to download the script and run it at the same time.
```sh
curl -sL <URL TO BE ADDED> | bash -E
```
If `cURL` is not installed you can use `wget` the script will install `cURL` if its not installed, below is the way to download the script and how to run it.
```sh
wget <URL TO BE ADDED> -o .\WorkScheduler.sh
chmod +x .\WorkScheduler.sh
.\WorkScheduler.sh
```

### Self Hosted
To deploy the system on your local environment you will need to clone the repository locally and run the following command (while in the project root):
```sh
node app.js
```


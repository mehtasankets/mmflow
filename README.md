# MM-Flow Application

## Deployment instructions

### VM Creation
* Create new VM on GCP (Google cloud platform)
* `sudo apt-get update`
* VPC Network > External IP addresses

### DNS route setup
* Cloud DNS > add record set > setup external IP address

### Nginx prox Setup
(https://www.linode.com/docs/web-servers/nginx/how-to-install-nginx-ubuntu-18-04/)
* `sudo apt-install nginx`
* `vim /etc/nginx/sites-available/mehtasanket.in`
* Put below content:
```
server {
    listen 80;
    server_name mmflow.mehtasanket.in;
    location / {
        proxy_pass "http://127.0.0.1:8080";
    }
}
server {
    listen 80;
    server_name mmflow-backend.mehtasanket.in;
    location / {
        proxy_pass "http://127.0.0.1:8090";
    }
}
```
* `sudo ln -s /etc/nginx/sites-available/mehtasanket.in /etc/nginx/sites-enabled/`
* `sudo nginx -t` # To verify rules
* `sudo nginx -s reload` 	# To reload rules
* `systemctl status nginx`


### Node, NPM setup
(https://www.geeksforgeeks.org/installation-of-node-js-on-linux/)
* `sudo apt-get install nodejs`
  * `node -v`
* `sudo apt-get install npm`
  * `npm -v`

### Java setup
(https://stackoverflow.com/questions/52504825/how-to-install-jdk-11-under-ubuntu)
`sudo add-apt-repository ppa:linuxuprising/java`
`sudo apt-get update`
`sudo apt-get install openjdk-11-jdk`
`java --version`

### Sqlite setup
(https://linuxhint.com/install_sqlite_browser_ubuntu_1804/)
* `sudo apt-get install sqlite3`

### Project setup
`git clone https://github.com/mehtasankets/mmflow.git`

(mmflow.db) Run db query versions if any

(frontend) `npm install`

(frontend) `npm run dev &`

(deployment) `export MMFLOW_DB_HOST_LOCATION=/home/mehtasankets/mmflow.db`

(deployment) `export CLIENT_ID=<GOOGLE-OAUTH-CLIENT-ID>` 	# Get it from GCP

(deployment) `java -server -jar mmflow-0.0.1-SNAPSHOT-all.jar`
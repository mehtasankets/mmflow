# MM-Flow Application

## Local deployment instructions

### One time setup
* [Install Docker](https://docs.docker.com/engine/install/ubuntu/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)
* [Install SQLite Database](https://linuxhint.com/install_sqlite_browser_ubuntu_1804/) (Optional) <br/>
  `sudo apt-get install sqlite3`
* [Install Nginx](http://nginx.org/en/docs/windows.html)<br/>
  Edit `server` block in <nginx-folder>/conf/nginx.conf to configure Nginx
  ```
  listen       80;
  listen       [::]:80;
  server_name mmflow.mehtasanket-dev.in;
  location / {
      proxy_pass http://localhost:8080;
  }
  ```
* Install nodejs, npm
  ```
  curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
  sudo apt-get install -y nodejs
  sudo apt-get install -y npm
  ```

### Start local instance
* Start Nginx: `start nginx`
* Run containers: `./local-run.sh`

Access the site at http://mmflow.mehtasanket-dev.in/

---

## Cloud deployment instructions

### VM Creation
* Create new VM on GCP (Google cloud platform)
* `sudo apt-get update`
* VPC Network > External IP addresses

### DNS route setup
* Cloud DNS > add record set > setup external IP address

### Nginx proxy Setup
(https://www.linode.com/docs/web-servers/nginx/how-to-install-nginx-ubuntu-18-04/)
* `sudo apt-install nginx`
* `vim /etc/nginx/sites-available/mehtasanket.in`
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

### Sqlite setup
(https://linuxhint.com/install_sqlite_browser_ubuntu_1804/)
* `sudo apt-get install sqlite3`

### Project setup
* `git clone https://github.com/mehtasankets/mmflow.git`
* cd mmflow
* Run db query versions if any
* `cp prod-env.list-tmpl prod-env.list`
* Edit prod-env.list to populate environment variables
* `./run.sh`
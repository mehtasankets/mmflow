# MM Flow

To manage Monthly Money Flow

## One time setup instructions

### Install nginx:
```
Follow instructions from http://nginx.org/en/docs/windows.html
```

### Configure nginx.conf:
vim `server` block in <nginx-folder>/conf/nginx.conf
```
listen       80;
listen       [::]:80;
server_name mmflow.mehtasanket-dev.in;
location / {
    proxy_pass http://localhost:8080;
}
```

### Install nodejs, npm:
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
```

### Install packages:
`npm install`

## Run instructions
```
(Windows cmd nginx folder) start nginx
(From project folder) npm run dev
```

Access the site at http://mmflow.mehtasanket-dev.in/

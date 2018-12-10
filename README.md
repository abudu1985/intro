## Requirements
- Node.js >= 7.6
- MongoDB >= 3.4.4

## Installation
```
$ cd back
$ npm install
```

## Configuration
Default config can be seen in `external/config.js` file.
Configuration is searched and loaded from file `/etc/cgnintro.json`. If no file was found default config is used.
For reference can be taken `cgnintro_example.json` file from repository.

- `ldapUser`, `ldapPass` - superuser credentials
- `logLevel` - `debug`, `info`
- `mongoDB` - how to access mongo storage. Used default port 27018
- `port` - used by the server itself
- `ca` - full path to certificate (needed for LDAP connection). Default is `/etc/ssl/certs/rootca.crt`
- `additionalAdminLogin` - login for user with admin rights. If left empty this feature will not work.
- `additionalAdminPassword` - password for user with admin rights. If left empty this feature will not work.
- `recaptchaSecretKey` - recaptcha secret key. Site key should be added into the `front` part of this project. Refer to it's README file (hint: add it to the `index.html` file). If no key passed will be used default precreated key.

## Start
```
$ node index.js
```

## Logging configuration
The application sends logs to `/var/log/syslog` using `systemd` then `rsyslog` transfers logs to the file. 

## systemd unit file
```
[Unit]
Description= Index
After=mongod.service

[Service]
ExecStart=/usr/bin/node /root/back/index.js
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cogniance-index
#User=<alternate user>
#Group=<alternate group>
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
```

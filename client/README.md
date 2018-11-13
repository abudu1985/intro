# Cogniance Intro page Client

## Installation
clone latest `prebuilt` branch of this repository into directory and serve it as usual static files by nginx.

## Setup
Default reCAPTCHA site key is used. In order to change it please find in `index.html` next line and change it to your key.
```
    <script>
      var recaptchaKey = "6Le1aiwUAAAAAEQZ9zmQjMnj0aBxVX-pKhBXK-RQ";
    </script>
```


**NOTE**
In order to function correctly a back part should be served under `/api` route like `www.example.com/api`. And all unmatched requests should be redirected to `index.html`.

So the basic nginx config for dev purposes may looks so:
```
server {
    root /var/www/cgnintro;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000/;
    }
} 

```
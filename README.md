# vr-booru
Angular project to browse boorus in a simple an non-efficient way

Run:
```
npm install
npm start
```

## Requirements
WebVR now requires an HTTPS connection, so you need an SSL cert.
Run ```openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365``` to
generate key and cert files and configure the passphrase in the config file.

Point your browser to ```localhost:8080``` to select some tags and click the first
image that you want to view in the viewer endpoints.

Currently you can see images and gifs in ```localhost:8080/viewer``` and you can
surround yourself in those images in ```localhost:8080/vr```. VR endpoint is
compatible with google cardboard and both the viewer and VR have autoplay for
a hands free experience.

## Configuring it
Right now there's not so much to config. But you can edit whatever you want.
Some sites are supported, other don't. Should be enough.
Searches 40 pictures in the selected site by default.

## Disclaimer
VR mode stretches images to fit the canvas. GIFs do not work on VR mode yet.
Images are stored in ```public/assets/img/download/``` for the Local Remix option.
These are never deleted so you might end up with lots of images. Clean up.

# vr-booru
Angular project to browse boorus in a simple an non-efficient way

Run:
```
npm install
npm start
```

Point your browser to ```localhost:8080``` to select some tags and click the first
image that you want to view in the viewer endpoints.

Currently you can see images and gifs in ```localhost:8080/viewer``` and you can
surround yourself in those images in ```localhost:8080/vr```. VR endpoint is
compatible with google cardboard and both the viewer and VR have autoplay for
a hands free experience.

## Configuring it
Right now there's no config. But you can edit whatever you want. By default,
searches 20 random explicit pictures in gelbooru. With very little effort you
can change the site, number of pictures and so on. This i being worked on.

## Disclaimer
Some images do not work at all. VR mode stretches images to fit the canvas.
Images are stored in ```public/assets/img/download/``` for the Local Remix option.
These are never deleted so you might end up with lots of images. Clean up.

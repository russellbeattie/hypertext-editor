# Hypertext HTML Document Editor

## About

Version 1.0 - Beta. October 2022.

Created by [Russell Beattie](https://www.russellbeattie.com).

Find the project code here:
<https://github.com/russellbeattie/hypertext-editor>. It\'s open source,
pull up a chair and feel free to try it out and submit bug reports. Pull
requests will be happily welcomed with open arms as long as you\'re not
an idiot.

Also, there\'s zero tracking in the app itself. I haven\'t even turned
on logging on the server. When I update the app, it should update your
local copy when you open it\... If the app seems to suddenly refresh on
you, it\'s working as intended, though not ideally.

**Disclaimer**: I wouldn\'t use this thing for anything important just
yet, or you know, try to edit any HTML file you particularly care about.
It tends to mangle markup that the app hasn\'t created itself. Don\'t
say I didn\'t warn you.

-Russ

## Open Source Projects

Powered by the hard work of the folks at
[TinyMCE](https://github.com/tinymce/){style="font-weight:bold"}, plus a
bunch of hours of my own work trying to figure out why the hell they
wrapped all the standard DOM APIs and what I needed to do to make it
play nice. Thanks guys!

Plus I slapped in [CodeMirror](https://github.com/codemirror) for the
code bits. It\'s still not working correctly, but looks pretty.

Thanks to whoever it is who made this:
<https://github.com/Alyw234237/md-wysiwyg-editor>. It was super helpful
in showing me how some of the wonky bits worked.

Also thanks to the Google dev relations guys for the file stuff here:
<https://googlechromelabs.github.io/text-editor/>.

## How to run this app using Docker

**Clone the repository**

```
git clone https://github.com/manjularajamani/hypertext-editor.git

cd hypertext-editor

docker build -t <image_name> .

docker run -d -it --name <container_name> <image_name>

```
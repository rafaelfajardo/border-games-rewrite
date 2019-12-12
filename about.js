/*
This is a remaking and remastering of Crosser, a product of SWEAT from the year 2000

in the code we will focus on clarity of code over optimization available through abstractions

the earliest versions of this remake are being created within OpenProcessing.org,
using P5JS, a project initiated and led by Lauren McCarthy,
enabling the P5Play library by Paolo Pedercini,
on an iPad Pro (2018) in Safari for iOS, and a MacBookPro (early 2019)
tested in both Safari and Chrome
it is hoped that it will run on a Raspberry Pi in Chromium

work began in earnest on this effort mid May of 2019

ORIGINAL TEAM AND WORK
Crosser was made by
Rafael Fajardo
Francisco Ortega
Miguel Tarango
Marco Ortega
Ryan Molloy
Tomás Márquez
Carmen Escobar
in El Paso, Texas, USA and Ciudad Juarez, Chihuahua, MEX
using the Apple abandoned software Cocoa (Design Release 2 or later) for Mac OS 7.6 - 9
and was later ported in Stagecast Creator for Mac OS X

======
2000.10.20

Crosser & La Migra should be released into the public domain. Programmers should donate their time as a charitable, tax-deductible, contribution, as should the artists. The equipment should be provided by the state. Let us put the SWEAT imprimatur on it.

The games should be cross-platform, created in an open-source programming environment.

[Should we trade in lithographs pulled from sketches and screen shots as a self-supporting activity? T-shirts?]

[Java?
Unix?
C++?
Cocoa?
Stagecast?
Flash?]

[All proceeds from the sale of merchandise go into self-supporting activities.]

[Which production costs can be downloaded?]

[Sketches treated as art used to prepare documents! Get Grid Paper]

======
2019 10 15
have been finally able to spin up a local server on my laptop and have a version of the game work in Chrome browser. So development will proceed on MacBookPro 15-inch 2018 running Mac OS 10.14.6 Mojave. Google Chrome Version 77.0.3865.120 (Official Build) (64-bit). I had to use CDN versions of P5JS and P5Play to overcome error messages in the browser developer console. I had to comment out inclusion of the P5Sound library. The local server was the Python2 SimpleHTTPServer that comes bundled with MacOS.

======
2019 10 16
I have moved folders around on my hard drive as I'm trying to rationalize workflow, version control, and version numbering. The code used to test the local server came from Crosser Remastered version 0.07.01. OpenProcessing Sketch728290.zip is the source of this version. It will be the canonical fork henceforward. OpenProcessing Sketch760043.zip includes some changes to the functions for gamepad controller and, possibly, for the win condition. These will have to be merged into the canonical branch.

I have created folders/directories called lib, img, history, dependencies.

lib will hold the P5js, P5Sound, P5DOM, and P5play libraries. I hope to have the local server use these instead of those on the CDN (Content Delivery Network).

img will hold the images that will be loaded into the sprites.

history holds the .zip archives of Sketch728290 (v.0.07.01) and Sketch760043 (v.0.07.02) for the sake of archives.

dependencies will hold the .zip archives of the versions of p5.js and p5.play.js as downloaded from source on GitHub.

=======
2019 10 17

========
2019 10 22
a couple of days ago I downloaded Node.js to my laptop and tried to spin up http-server. I couldn't get it running. I reread some reference material from the P5.JS wiki on github and was able to serve mySketch.js (Crosser) locally, still relying on the CDN for p5.js and p5.play.js. I have not yet attempted to use urls that point to localhost. that will come soon. The version of Node.js I downloaded is 10.16.3 LTS from nodejs.org

=======
2019 10 23
In index.html: I have commented out the CDN calls to to the libraries for P5.JS and P5.Play.JS. I have written script tags that use absolute paths as URLs http://localhost/... The attempt without reference to port failed, but the attempt with the port number (8080 in this case) worked. I continue to get an error message with respect to "Animation" and to "camera"

======
2019 10 30
I have had the Node.js server running in the background for a week on my development laptop. It has been running in the background. Since Javascript is a client-side language the last call to the server is from last week. The Chrome browser window continues to run the sketch whenever I bring it to the foreground. Like a lightbulb in a refrigerator I cannot tell if it is on when it is in the background. I will refresh the browser window and likely see fresh calls to the server. ... Yup. THe server log shows "GET" calls with today's date and time.

Now I have to remember how to set this dependency up and figure out version control. There is a downloadable version of GIT that promises local control and change log. I could use GitHub or GitLab, but I don't know if that creates too much overhead. The latter two, at least, would be shareable if I end up needing help.

In the last seven days I have also finalized artwork for the catalog and provided reference material for captions which included release dates for the prior versions of Crosser and La Migra. I was able to find the first mention of Cocoa on the TidBits.com website. They have kept an archive of all their entries. There is also mention of Stagecast Creator there as they followed the development of that software.

I looked it up on Wikipedia and this project would be considered rewriting Crosser and La Migra to re-implement existing functionality. Refactoring uses existing code. Rewriting does not use any of the existing code. Since I don't have access to the original source code then this is a rewrite.

It may be best to use GitHub as the version control for this project so that I can call on Paolo Pedercini if needed. I can also clone the p5.js and p5.play.js repositories to keep a version in history. (I'm not sure about that, though)

======
2019 11 07
Yesterday I gathered the visual art assets for La Migra into a folder/directory tentatively called img-lamigra. The number of images is far larger than for Crosser, and so I thought it might be beneficial to use sprite sheets, which would gather several images into a single image file that would be referenced by and loaded with the sprite elements of the P5.Play.JS library. Today I reviewed how the library handles sprite sheets. At first glance it seems that it wont' work to simplify the contents of the img-lamigra folder.

I grabbed the images from my hard drive called storage. File path: storage/Storage/_Arid/Visual Work/La Migra Archive. Some of the files are Apple PICT (or PCT?) files which I could open with Preview. GIMP would not open them. The old Photoshop files could be opened by GIMP, howerver. I resaved some of these as native GIMP files XCF.

Yesterday I also renamed the mySketch file to reflect the content. It is now crosser000800.js. This means that it is version 00.08.00 of the crosser rewrite. This harmonizes the version numbering that began with OpenProcessing.org. I also created a template file for lamigra000000.js

Today; I also added a line of code to the draw() function so that it would draw a white background every frame. I corrected the same instruction in the setup() function which had the color value as 256, which was wrong. In addition, I moved the snes sprite to the y-position of 448 so that its top edge aligns with the bottom edge of the map, and the mouse click commands realign with the artwork.

I still am reticient to start a GitHub repository for the project. Microsoft has done some objectionable things in the last week with GitHub accounts that may have some involvment in China, and Hong Kong in particular. Esteban thinks that GitHub will be the fastest way for me to solicit help if I need it. I remain uneasy. The Atom text editor in which I am writing this has GitHub integration. I also have used the GitHub desktop app in the past for projects written in Processing. GitKraken also has GitHub integration. I have a wealth of choices at my fingertips.

The Node.js http-server stopped live updating the Chrome browser tap that I have had open for the last month. This should only have a consequence for development and maintenance, and not for exhibition. I restarted the server and will see if it resumes live updates monday. (I have to be on campus for meetings tomorrow). I don't know if it's a Chrome issue or an Atom issue, or Node.js issue.

I found the la-migra-report.html which was generated by Stagecast Creator as an abstract text-based interpretation of the visual program. I copied it into the history folder of this project. I also moved the copy of the crosser-report.html into the history folder.

I placed a couple of versions a favicon into the root folder of the project.

It never feels like I'm actually getting anything done.

Denver Art Museum has arranged to come to the studio and interview me on December 5, 2019.h


2019 11 23
this fils should be deprecated in famvor of 'about.txt' going forward

*/

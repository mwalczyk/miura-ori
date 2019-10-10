# cp
📜 A tool for generating semigeneralized Miura-ori crease patterns.

<p align="center">
  <img src="https://github.com/mwalczyk/cp/blob/master/screenshots/screenshot.png" alt="screenshot" width="400" height="auto"/>
</p>

## Description
A drawing tool that creates [Miura-ori crease patterns](https://en.wikipedia.org/wiki/Miura_fold) from an arbitrary, user-defined cross-section. You can use the tool at the [following URL](https://mwalczyk.github.io/cp/).

## Tested On
- Firefox

## To Build
1. Clone this repo.
2. Make sure [npm](https://www.npmjs.com/) is installed and in your `PATH`.
3. Inside the repo, run: `npm install`.
4. Open `index.html` in your browser.

## To Use
Use your mouse to add points in the upper canvas. The points will be connected to form a polyline, which, in turn, will be used to generate the Miura-ori crease pattern (displayed in the lower canvas). Additional controls:
- Press the `clear` button to clear the current path
- Press the `save` button to export the crease pattern as a [.FOLD file](https://github.com/edemaine/fold)
- Adjust the `repetitions` slider to change the number of times that the crease pattern is repeated vertically (this corresponds to the "width" of your paper, while the horizontal axis corresponds to the "length")

## To Do
- [ ] Allow for an adjustable strip width
- [ ] Calculate the shallow angle based on the strip width
- [ ] Create a clean, reusable `CreasePattern` module
- [ ] Add additional methods to the `Matrix` module

## Credits
This project was largely inspired by Robert Lang's book, [Twists, Tilings, and Tessellations](https://langorigami.com/publication/twists-tilings-and-tessellations-mathematical-methods-for-geometric-origami/), which outlines the theoretical / mathematical implications of semigeneralized Miura-ori crease patterns (see `Chapter 2`).

### License
[Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/)


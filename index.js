#!/usr/bin/env node

//TODO add cli options: custom bulb id option

//  $ "yee-sync" to start the script.

const screenshot = require("screenshot-desktop"); //Screenshot Library
const average = require("image-average-color"); //Average Color Library
const Lookup = require("node-yeelight-wifi").Lookup; //Yeelight Library
const chalk = require("chalk"); //Chalk - console color lib

let look = new Lookup();

look.on("detected", (light) => {
  //Run sync when light detected (Check light.id here if you have more than one lights)
  runSync(light);
});

async function runSync(light) {
  let color;
  let img;

  // Loop every second
  setInterval(loop, 1000);

  async function loop() {
    // Get screenshot
    img = await screenshot();
    // Get average color of the image
    average(img, (err, res) => {
      if (err) throw err;
      color = res;
      console.log(
        chalk.bold.rgb(color[0], color[1], color[2])(`Color found: ${color}`)
      );
    });
    // Set light to that color
    light
      .setRGB(color, 1000)
      .then(() => {
        console.log(
          chalk.bold.rgb(color[0], color[1], color[2])(`Color set to ${color}`)
        );
      })
      .catch((error) => {
        console.log("failed to set color", error);
      });
  }
}

#!/usr/bin/env node

//TODO add cli options: custom bulb id option

//  $ "yee-sync" to start the script.

const screenshot = require("screenshot-desktop"); //Screenshot Library
const average = require("image-average-color"); //Average Color Library
const Lookup = require("node-yeelight-wifi").Lookup; //Yeelight Library

const chalk = require("chalk"); //Chalk - console color lib

let look = new Lookup();

look.on("detected", (light) => {
  light.on("connected", () => {
    console.log("Connected");
  });
  setInterval(() => {
    screenshot()
      .then((img) => {
        average(img, (err, color) => {
          if (err) throw err;
          console.log(
            chalk.bold.rgb(
              color[0],
              color[1],
              color[2]
            )(`Color found: ${color}`)
          );
          light
            .setRGB(color, 500)
            .then(() => {
              console.log(
                chalk.bold.rgb(
                  color[0],
                  color[1],
                  color[2]
                )(`Color set to ${color}`)
              );
            })
            .catch((error) => {
              console.log("failed to set color", error);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000);
});

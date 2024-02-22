const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const { IOhandler, filter, readDir, unzip } = require("./IOhandler");
const grayscale = require("./IOhandler");
const { pipeline } = require("stream");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "processed");

const filterType = 'sepia'


unzip(zipFilePath, pathUnzipped)
.then(() => {
    return readDir(pathUnzipped);
})
.then(

    files => {
    files.forEach(file => {
    filter(file, pathProcessed, filterType)
    });
})
.catch(error => {
    console.error("An error occured:", error);
})
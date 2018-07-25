const { demo, group, wait, using } = require("demokit");
const { type, paste } = require("demokit/keyboard");
const scene = require("demokit/scene");
const recording = require("demokit/recording");
const browser = require("demokit/window/browser");
const { click } = require("demokit/mouse");
const window = require("demokit/window");

module.exports =
<demo>
    <scene width = { 500 } height = { 500 } />

    <console.log>Opening Browser</console.log>
    <browser
        id = "scotlandjs"
        title = "Scotland JS"
        contentURL = "http://scotlandjs.com/"
        contentRect = {{
            origin: {
                x: "center",
                y: "center"
            },
            size: {
                width: 500,
                height: 500
            }
        }}
    />

    <recording.start filePath = "video" />
        <using window = "scotlandjs">
            <console.log>Scrolling the page</console.log>
            <wait delay = { 1500 }/>
            <window.scroll selector = "#venue" />
            <wait delay = { 1500 }/>
            <window.scroll selector = "#bs-example-navbar-collapse-1" />
            <wait delay = { 1500 }/>
            <console.log>Clicking the menu</console.log>
            <click selector = "[data-target='#bs-example-navbar-collapse-1']" />
            <wait delay = { 1500 }/>
            <console.log>Clicking schedule</console.log>
            <click dx = { -180 } selector = "[href='/schedule']" />
            <wait delay = { 1500 }/>
            <window.scroll selector = "#speaker" />
            <wait delay = { 2000 }/>
        </using>
        <console.log>Stopping recording</console.log>
    <recording.stop />

    <console.log>Exporting video</console.log>
    <process.exit />
</demo>

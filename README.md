# SiliWiz

[![Build and Lint](https://github.com/TinyTapeout/siliwiz/actions/workflows/ci.yml/badge.svg)](https://github.com/TinyTapeout/siliwiz/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/TinyTapeout/siliwiz)

SiliWiz is a free educational tool to help you learn the basics of how semiconductors work and manufactured at a fundamental level.

For more information, see the [SiliWiz Lessons website](https://tinytapeout.com/siliwiz/).

## Cloud Development

You can hack on the project by opening it on [Gitpod](https://gitpod.io/#https://github.com/TinyTapeout/siliwiz). This opens a full development environment in your browser, including a code editor, terminal, and a preview pane where you can see your changes in action.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or later) and NPM (usually comes with Node.js)

### Instructions

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open [http://localhost:5173](http://localhost:5173) in your browser

Enjoy!

### PDK Files

SiliWiz uses the following technology file for Magic: [siliwiz.tech](https://app.siliwiz.com/assets/siliwiz.tech). It has been adapted from the [sample_6m tech](http://opencircuitdesign.com/magic/archive/sample6m.tech) file, adding a MiM cap device between the metal1 and metal2 layers.

The simulation is powered by a trimmed down version of ngspice, built from the [ngspice-minimal branch](https://sourceforge.net/p/ngspice/ngspice/ci/minimal-ngspice/tree/). This version includes only the Current & voltage sources, BJT, MOS1, Ind, Cap and Res models (see [the relevant commit](https://sourceforge.net/p/ngspice/ngspice/ci/b028c77824bbac58db5cfa387620c682188f916e/) for models included).

## License

SiliWiz is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for more details.

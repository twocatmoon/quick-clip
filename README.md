<div id="top"></div>
 
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Quick Clip</h3>

  <p align="center">
    Quick Clip generates FFMPEG CLI commands from a drag-and-drop UI, so you can easily crop, trim, and transcode video clips.
    <br />
    <a href="https://quick-clip.twocatmoon.com"><strong>Start using Quick Clip »</strong></a>
    <br />
    <br />
    <a href="https://github.com/twocatmoon/quick-clip/issues">Report Bug</a>
    ·
    <a href="https://github.com/twocatmoon/quick-clip/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#local-development">Local Development</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Quick Clip was designed in an effort to make taking quick clips of the projects you're working on easy. 
Use Quick Clip's drag-and-drop UI to quickly generate [FFMPEG](https://ffmpeg.org/) CLI commands to export your clips to mp4s or gifs.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE -->
## Usage

1. Drag a video into the window.
2. Crop and trim your video.
3. Choose an export option to copy an FFMPEG command to your clipboard.
4. Open a command prompt like PowerShell or xTerm and navigate to the directory your source file is located.
5. Paste the command into the command prompt and press return.

Your clip will be exported into the same directory as the source video as either `clip.mp4` or `clip.gif`, depending on your selected format.

_Please note that FFMPEG must be installed on your system for these commands to work. Please see [this link](https://ffmpeg.org/download.html) for more information on how to install FFMPEG._

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LOCAL DEVELOPMENT -->
## Local Development

To run Quick Clip locally, follow these steps:

### Prerequisites

* NodeJS version 15.0 or higher

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:twocatmoon/quick-clip.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the app
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Resize crop area with horizontal and vertical handles
- [ ] Better labeling and UX for trim/seek UI
- [ ] Dedicated FFMPEG server to cut out the need to run the commands locally

See the [open issues](https://github.com/twocatmoon/quick-clip/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Twitter - [@twocatmoon](https://twitter.com/twocatmoon)

Project Link - [https://github.com/twocatmoon/quick-clip](https://github.com/twocatmoon/quick-clip)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/twocatmoon/quick-clip.svg?style=for-the-badge
[contributors-url]: https://github.com/twocatmoon/quick-clip/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/twocatmoon/quick-clip.svg?style=for-the-badge
[forks-url]: https://github.com/twocatmoon/quick-clip/network/members
[stars-shield]: https://img.shields.io/github/stars/twocatmoon/quick-clip.svg?style=for-the-badge
[stars-url]: https://github.com/twocatmoon/quick-clip/stargazers
[issues-shield]: https://img.shields.io/github/issues/twocatmoon/quick-clip.svg?style=for-the-badge
[issues-url]: https://github.com/twocatmoon/quick-clip/issues
[license-shield]: https://img.shields.io/github/license/twocatmoon/quick-clip.svg?style=for-the-badge
[license-url]: https://github.com/twocatmoon/quick-clip/blob/master/LICENSE.txt

<img alttext="COVID Green Logo" src="https://raw.githubusercontent.com/lfph/artwork/master/projects/covidgreen/stacked/color/covidgreen-stacked-color.png" width="300" />

## Getting Started

Following these instructions will allow you to run and build the project on your local machine for development and testing purposes.

### Prerequisites

Follow the official guide "[Setting up the development environment](https://reactnative.dev/docs/environment-setup)" to set up your local machine to develop iOS and Android applications with React Native.

Install an Xcode version that supports iOS 14

### Installing

Clone this repository.

Install the npm dependencies:

```bash
npm i
```

Create your `.env` file or copy it from the `.env.sample`:

```bash
cp .env.sample .env
```

Move to `ios/` folder and install the CocoaPods dependencies:

```bash
cd ios && pod install
```

## Running the applications locally

Start the React Native bundler:

```bash
npm start
```

To start the Android application, run:

```bash
npm android
```

To start the iOS one, run:

```bash
npm ios
```

## Team

### Lead Maintainers

* @colmharte - Colm Harte <colm.harte@nearform.com>
* @salmanm - Salman Mitha <salman.mitha@nearform.com>
* @aspiringarc - Gar Mac Críosta <gar.maccriosta@hse.ie>

### Core Team

### Contributors

### Past Contributors

* TBD
* TBD

## Hosted By

<a href="https://www.lfph.io"><img alttext="Linux Foundation Public Health Logo" src="https://raw.githubusercontent.com/lfph/artwork/master/other/lfph/stacked/color/lfph-stacked-color.svg" width="200"></a>

[Linux Foundation Public Health](https://www.lfph.io)

## Acknowledgements

<a href="https://www.gov.ie"><img alttext="Goverenment of Ireland Logo" src="https://www.gov.ie/static/_reboot/_reboot_app/img/Image_Logo.png" width="200" /></a><a href="https://nearform.com"><img alttext="NearForm Logo" src="https://openjsf.org/wp-content/uploads/sites/84/2019/04/nearform.png" width="400" /></a>

## License

Copyright (c) 2021 Gov.ie
Copyright (c) The COVID Green Contributors

[Licensed](LICENSE) under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

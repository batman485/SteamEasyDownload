# Steam Easy Download
Easily download a list of games from Steam

## Prerequisites
Pkg
- npm install -g pkg
- More information available at: [https://www.npmjs.com/package/pkg](https://www.npmjs.com/package/pkg)

## Setup
1. Copy Settings.ini.sample and rename to Settings.ini
2. In your newly renamed Settings.ini file, set your Steam Username and Password on the user and pass variables
3. On the appids variable, add a comma seperated list of Steam apps or games you would like to have Steam Easy Downloader download for you. App Ids can be found at [https://steamdb.info/](https://steamdb.info/).
4. Save the Settings.ini file with these updates

## How to Build
1. In package.json, set the pkg > targets array to the desired build targets. Information on targets can be found at [https://github.com/vercel/pkg#targets](https://github.com/vercel/pkg#targets)
2. In a terminal, run the command:
```
pkg .
```
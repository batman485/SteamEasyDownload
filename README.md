# Steam Easy Download
Easily download a list of games from Steam

## Setup
1. Open the Settings.ini file by right clicking on it and then clicking on Edit
2. Under the Steam section:
    - Enter the path to your steam.exe file after exepath=.
    - Enter the path to your steamapps folder after apppath=.
    - (Optional) Enter your Steam username after user=.
    - (Optional) Enter your Steam password after pass=.
3. On the appids variable, add a comma seperated list of Steam apps or games you would like to have Steam Easy Downloader download for you. App Ids can be found at [https://steamdb.info/](https://steamdb.info/).
4. Save the Settings.ini file with these updates

## How to Run Steam Easy Download
1. Right click on SteamEasyDownload.exe and then Run as administrator.

Note: If you have Steam Guard enabled, it will prompt you to put in a Steam Guard Code before downloads will begin

## Building from Source
### Prerequisites
Pkg
- npm install -g pkg
- More information available at: [https://www.npmjs.com/package/pkg](https://www.npmjs.com/package/pkg)

### How to Build
1. In package.json, set the pkg > targets array to the desired build targets. Information on targets can be found at [https://github.com/vercel/pkg#targets](https://github.com/vercel/pkg#targets)
2. In a terminal, run the command:
```
pkg .
```
# get-deister-ids

Automatically get a list of all users that have an "Identmedium" in Deister CommanderConnect.

# Prerequisites

Make sure you run the software on the server where the Commander runs!

```sh
npm i
npm run build
```

# Usage

1. Log in to Commander using the web interface (http://localhost:8095/).
2. Grab the value of the `JSESSIONID` cookie from your browser.
3. Run `npm start <SESSION_ID>` (e.g. `npm start 97E07D75EAAB253C68C0D8A4F1BFBDB0`)
4. See the names in `logs/<date_time>_names.txt`

## Configuration

If your commander doesn't run on `http://localhost:8095/` you can create a `.env` file in the root-directory of the project to change it.

```
API_URL="http://localhost:8095/"
```

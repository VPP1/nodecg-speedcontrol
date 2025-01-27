# Configuration

Speedcontrol can be used without any configuration, but you will need to do this to get most features to work, such as Twitch integration.

We use the normal [NodeCG bundle configuration](https://www.nodecg.dev/docs/nodecg-configuration) so see that page for some basic details on where the configuration file should go. *tl;dr:* put a JSON file called `nodecg-speedcontrol.json` in your NodeCG installation's `cfg` folder.

If you haven't, I would recommend installing [nodecg-cli](https://github.com/nodecg/nodecg-cli), then you can do either do `nodecg defaultconfig` in the bundle's directory or `nodecg defaultconfig nodecg-speedcontrol` in the NodeCG installation folder and this will create a default configuration file in the correct place with *some* of the settings you can configure already partially filled out, although you will still need to tweak this. See below for what can go in this file in more detail.

As normal with NodeCG, you will need to restart your instance of the NodeCG server when you change the config for them to be applied.

If you're an experienced user you can also check out the [configschema.json here](../configschema.json). As an additional note: if you see a configuration option avaiable in the schema that isn't documented here, assume it my change at any time.

Below is an example configuration file contents with everything that is available (*do **not** copy this and put it in directly without any modifications; it won't work, sorry*):

```json
{
  "language": "en",
  "twitch": {
    "enabled": true,
    "clientID": "CLIENT_ID",
    "clientSecret": "CLIENT_SECRET",
    "redirectURI": "http://localhost:9090/nodecg-speedcontrol/twitchauth",
    "additionalScopes": [
      "SCOPE"
    ],
    "channelName": "OTHER_CHANNEL",
    "streamTitle": "Game: {{game}} - Category: {{category}} - Players: {{players}}",
    "streamDefaultGame": "Games + Demos",
    "commercialsExtraButtons": false,
    "commercialsUseExternal": false,
    "ffzIntegration": false,
    "ffzUseRepeater": false
  },
  "horaro": {
    "defaultURL": "https://horaro.org/event/schedule",
    "ignoreGamesWhileImporting": [
      "Setup"
    ],
    "disableSpeedrunComLookup": false,
  },
  "oengus": {
    "defaultMarathon": "SHORTNAME",
    "useJapanese": false,
    "ignoreGamesWhileImporting": [
      "Setup"
    ],
    "disableSpeedrunComLookup": false,
    "useSandbox": false
  },
  "customData": {
    "run": [
      {
        "name": "Game (Short)",
        "key": "gameShort",
        "ignoreMarkdown": false
      }
    ],
    "player": [
      {
        "name": "Other Data",
        "key": "otherData"
      }
    ]
  }
}
```


## Breakdown

### Language

```json
{
  "language": "en"
}
```

This is the language code for the language used on the dashboard UI. The default is `en` (English).

The currently available languages are:
- `en` (English)
- `ja` (Japanese)

### Twitch

```json
{
  "twitch": {
    "enabled": true,
    "clientID": "CLIENT_ID",
    "clientSecret": "CLIENT_SECRET",
    "redirectURI": "http://localhost:9090/nodecg-speedcontrol/twitchauth",
    "additionalScopes": [
      "SCOPE"
    ],
    "channelName": "OTHER_CHANNEL",
    "streamTitle": "Game: {{game}} - Category: {{category}} - Players: {{players}}",
    "streamDefaultGame": "Games + Demos",
    "commercialsExtraButtons": false,
    "commercialsUseExternal": false,
    "ffzIntegration": false,
    "ffzUseRepeater": false
  }
}
```

This is the part where the Twitch integration configuration is set up. Make sure `enabled` is true (it defaults to `false`), and then you will need to [create a Twitch API app yourself from their developer site](https://dev.twitch.tv/console/apps/create) and put in the supplied client ID and client secret. The redirect URI should be the same as the one above unless you are **not** running your NodeCG server locally and/or you changed the port it uses.

- `streamTitle` is a string that specifies what the title will be updated to when a run is switched. There are some wildcards as seen above that will be replaced with the relevant data if they're specified. Leave it blank if you don't want to have the title updated.
- `streamDefaultGame` is the game in the Twitch directory that will be used if the game name from your schedule cannot be found in the directory.

FrankerFaceZ integration can also be enabled with `ffzIntegration`, this will make it so people who use the browser extension see the player(s) as a "featured" channel for easy following, and if enabled on your channel, will also add their FrankerFaceZ emoticons for use during their run (you will need to ask the devs of the extension to enable this for you).

Once the Twitch integration settings are fully set up and your NodeCG server has been (re)started, you will see a "Connect with Twitch" button on the dashboard, which can be used to authorise nodecg-speedcontrol with Twitch.

Currently, you must either:
- Login with the channel you wish to have the information updated for *or*
- Specify a channel name in the `channelName` setting that the account you logged in with has editor access for. Currently if this setting is used, the FrankerFaceZ integration will not successfully be able set the featured channels due to a limitation in the FrankerFaceZ service.

If you decide to use the 2nd option above, there is also another boolean, `ffzUseRepeater`; if this is true it will never attempt to set the FrankerFaceZ featured channels but instead will make the bundle emit a `repeaterFeaturedChannels` message so if you want to work around this limitation in your own bundle you can; see the [API documentation](API.md) for more information.

There is also another optional parameter, `additionalScopes`, which is an array of strings, which if any are specified will be added to the Twitch authorisation request and allow the token to have more control, which can be useful if you plan to use the [Twitch API request feature](./API/NodeCG-Messages.md#twitchAPIRequest) feature. By default we request these scopes, so if you specify these again they will be ignored:
- `channel:edit:commercial`
- `channel:manage:broadcast`
- `chat:read`
- `chat:edit`

The `commercialsExtraButtons` option adds more buttons on the *Twitch Control* dashboard panel (3:30 - 6:00); these will only work if your Twitch channel is allowed to run commercials of that length.

The `commercialsUseExternal` is an advanced option; it will stop the internal logic of communicating with Twitch to run commercials, and will make the bundle emit a `twitchExternalCommercial` message that can be picked up by other bundles so you can integrate your own logic; see the [API documentation](API.md) for more information. This is similar to the FrankerFaceZ repeater logic described above.


### Horaro Schedule

```json
{
  "horaro": {
    "defaultURL": "https://horaro.org/event/schedule",
    "ignoreGamesWhileImporting": [
      "Setup"
    ],
    "disableSpeedrunComLookup": false
  }
}
```

- `defaultURL` is a URL to the schedule on Horaro that will be pre-filled on the dashboard; usually you will only be using your setup for 1 marathon so this means you don't need to keep entering it every time you want to do a (re)import.
- `ignoreGamesWhileImporting` is an array of strings of games on your schedule that will be ignored on import; for example you may have setup blocks you don't want importing. This does partial matches ("Setup Block" will be matched by "Setup").
- `disableSpeedrunComLookup` is a boolean (defaults to `false`) that can be enabled, which will skip the speedrun.com look-ups during schedule import; by default the import will try to find the player's Twitch username, country and pronouns from speedrun.com, but if you do not need this you can disable it to speed up the import.


### Oengus Schedule

```json
{
  "oengus": {
    "defaultMarathon": "SHORTNAME",
    "useJapanese": false,
    "ignoreGamesWhileImporting": [
      "Setup"
    ],
    "disableSpeedrunComLookup": false,
    "useSandbox": false
  }
}
```

- `defaultMarathon` is the marathon's shortname on Oengus that will be pre-filled on the dashboard; this is the part of the URL *after* `oengus.io/marathon/`.
- `useJapanese` is a boolean (defaults to `false`) which if true, will tell the import to use the Japanese names of players on import instead of the international ones. This setting can also be toggled from the dashboard itself.
- `ignoreGamesWhileImporting` is an array of strings of games on your schedule that will be ignored on import. This does partial matches ("Setup Block" will be matched by "Setup"). Currently this does not check specific setup blocks created in Oengus.
- `disableSpeedrunComLookup` is a boolean (defaults to `false`) that can be enabled, which will skip the speedrun.com look-ups during schedule import; by default the import will try to find the player's Twitch username (if not already linked via Oengus) and country from speedrun.com, but if you do not need this you can disable it to speed up the import.
- `useSandbox` will make all lookups use the [sandbox version of Oengus](https://sandbox.oengus.io/) instead of the live version; useful for testing.


### Custom Data

```json
{
  "customData": {
    "run": [
      {
        "name": "Game (Short)",
        "key": "gameShort",
        "ignoreMarkdown": false
      }
    ],
    "player": [
      {
        "name": "Other Data",
        "key": "otherData"
      }
    ]
  }
}
```

*For advanced users!*

This is the part where you configure "custom data" that will also be able to be added/edited alongside any data the bundle can already handle.

- `run` is where the custom *run* data is configured; this is an array of objects. Anything configured here has the chance to appear within an object called `customData` within the run's data object. This will allow you to add a custom column when importing from a Horaro schedule and also edit/add these custom data values from the relevant dialog.
  - `name` is the formatted name that will appear in the Speedcontrol UI.
  - `key` is the key that will be used in the `customData` in the run data.
  - `ignoreMarkdown` is a boolean (defaults to `false`) which if true, will tell the Horaro import to not attempt to strip any markdown in the column's data for that run.
- `player` is where the custom *player* data is configured; this is an array of objects. Anything configured here has the chance to appear within an object called `customData` within the player's data object *inside* of the run data object. This is not automatically imported from anywhere as of yet and can only be added/edited via the dashboard.
  - `name` is the formatted name that will appear in the Speedcontrol UI.
  - `key` is the key that will be used in the `customData` in the player data.

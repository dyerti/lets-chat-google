# Let's Chat - Google Plugin

Add Google SSO support to [Let's Chat](http://sdelements.github.io/lets-chat/).

### Install

```
npm install lets-chat-google
```

### Configure

Create a web application in your Google developer console.
https://console.developers.google.com

Generate a OAuth client ID.
Enable Google+ API support.

###### Example

```yml
auth:
  providers: [google]

  google:
    clientID: '<Get from https://console.developers.google.com>'
    clientSecret: '<Get from https://console.developers.google.com>'
    callbackURL: 'https://chat.domain.example/account/google/callback'
    scope: 'openid email profile'
```

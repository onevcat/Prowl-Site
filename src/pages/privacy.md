---
layout: ../layouts/LegalLayout.astro
title: Privacy Policy
description: What Prowl, Prowl Mirror and the Prowl push service collect, and what they do not.
updated: November 23, 2026
---

This policy covers **Prowl** for Mac, **Prowl Mirror** for iPhone, iPad and Android, the optional
**Prowl push service** that Prowl Mirror uses for notifications, and this website. Prowl is made by
onevcat ("we", "us").

## The short version

- Prowl runs on your Mac. Your code, your terminals and your agents' conversations stay on your
  devices. We never receive them.
- We do not sell data, show ads, or track you across apps or websites.
- Prowl for Mac sends anonymous usage analytics and crash reports. You can turn off each one in
  **Settings → Advanced**.
- Prowl Mirror has no account, no analytics and no crash-reporting SDK. It talks directly to your
  own Mac.
- Push notifications are optional and off by default. Their content is end-to-end encrypted, so
  we, our hosting provider and Apple cannot read it.

## Prowl for Mac

### What stays on your Mac

Terminal output, file contents, repository and branch names, paths, agent conversations, and
everything you type stay on your Mac. Prowl does not send them to us.

### Usage analytics

Release builds send usage analytics to [PostHog](https://posthog.com) so that we can see which
features people use. An event is the name of an action, such as `app_launched` or
`worktree_created`, with:

- a random install ID, created on your Mac and not linked to your name, email or Apple ID;
- the app version, the macOS version, the Mac model, the CPU architecture and the locale;
- for a few events, numbers only: how many repositories you added, which editor you chose for
  **Open in**, how long a session lasted, or memory use with the count of repositories,
  worktrees and tabs.

Analytics events never contain paths, repository names, branch names, terminal output, file
contents or agent conversations.

### Crash reports

Release builds send crash reports to [Sentry](https://sentry.io) so that we can fix crashes. A
report contains the stack trace, the app version, the same install ID, the names of recent app
actions (without their data), and a small sample of performance traces. Diagnostics for a few
known problems, such as high memory use or a missing main window, are sent the same way; the
missing-window diagnostic includes the app's launch arguments, which contain a folder path when
Prowl was opened with one (for example by `prowl open <path>`).

### Turning them off

Open **Settings → Advanced → Analytics & Crash Reports** and turn off **Share analytics with
Prowl** or **Share crash reports with Prowl**. Analytics stops at once, and turning it off also
deletes the install ID. Crash reporting stops after you restart Prowl. Debug builds that you
compile yourself send neither.

Like any web service, PostHog and Sentry see the IP address that a request comes from. We do not
use it to identify you.

### Other connections

Prowl connects to the network only for the features that need it:

- **Update checks** with [Sparkle](https://sparkle-project.org), which downloads the release feed
  from GitHub. No system profile is sent.
- **Git, GitHub and SSH**: Prowl runs your own `git`, `gh` and `ssh` with your own configuration
  and credentials, against the servers you chose. Those services' own policies apply.
- **Remote Mirror**: connections from the devices that you pair (see below).

The coding agents you run in Prowl, such as Claude Code or Codex, are separate programs. They
talk to their providers under those providers' terms and privacy policies, which this policy
does not cover.

## Prowl Mirror (iPhone, iPad and Android)

- **No account, no analytics, no ads.** The app contains no analytics, advertising or
  crash-reporting SDK, and it does not track you.
- **A direct connection to your Mac.** The app connects to your Mac over your local network or
  your VPN, encrypted with a key that only your Mac and your device know from pairing. We run no
  server in between, so what you see in Prowl Mirror never passes through us.
- **What stays on your device:** the list of Macs you paired (address, port and the names you
  see) and the device key for each, kept in the Keychain on iPhone and iPad and encrypted with the
  Android Keystore on Android.
- **Camera:** used only to scan the pairing code. Images are not stored or sent anywhere.
- **Local network:** used only to reach your Mac.
- **Demo mode** shows built-in sample data. It stores nothing and connects to nothing.

If you allow it in your device settings, Apple or Google may share anonymous crash and usage
statistics with us, as with any app on their stores.

## Push notifications

Prowl Mirror can tell you when an agent on your Mac needs you or finishes. This is optional and
off by default: you turn it on both on the Mac and on your iPhone or iPad.

### How the content stays private

When you pair, your phone and your Mac share a key that never leaves them. Your Mac encrypts the
notification (which pane, its tab and worktree name, and what the agent asks or replies) with
that key before sending it. Our push service passes the sealed message to the Apple Push
Notification service, and only your phone can open it. We, our hosting provider and Apple see
only the general text "An agent on your Mac has an update".

**Show Details**, off by default, lets your phone show the decrypted text, also on the lock
screen.

### What the push service keeps

The push service runs on [Cloudflare Workers](https://workers.cloudflare.com). It keeps only what
it needs to deliver notifications:

| Data | Why |
| --- | --- |
| An App Attest key ID and public key for your app installation | To check that requests come from a real copy of Prowl Mirror |
| A random push token for each Mac you allow, with Apple's device token and the times it was created and last used | To deliver a notification from your Mac to your device |
| The IP address of a registration request | To limit abuse; deleted within a day |

It does not keep notification content, your Mac's name or address, your name, or any account,
and it does not log requests.

### Deletion

Turning off notifications, forgetting a Mac, or turning off every kind of notification for a Mac
deletes the matching tokens at once. Tokens unused for 90 days are deleted, and so is an
installation that has had no token for 90 days. When Apple reports that a device is gone, its
token is deleted.

## This website

This site has no analytics and sets no cookies. It is hosted by [Netlify](https://www.netlify.com),
which keeps standard server logs. Fonts load from Google Fonts, so Google receives your IP
address. The demo video loads from YouTube's privacy-enhanced mode only when you play it.

## Service providers

We use these providers to run the parts described above. They process data on our behalf,
possibly outside your country, including in the United States:

- PostHog (usage analytics, Prowl for Mac)
- Sentry (crash reports, Prowl for Mac)
- Cloudflare (push service)
- Apple (push delivery and App Attest)
- GitHub (releases and update feed)
- Netlify and Google Fonts (this website)

## Children

Prowl is a developer tool and is not directed at children under 13. We do not knowingly collect
data from them.

## Your choices

You can turn off analytics and crash reports at any time, leave push notifications off, forget a
paired Mac, or delete the apps. Because the data we receive is not linked to your identity, we
usually cannot find "your" records; if you have a request or a question, contact us and we will
help where we can.

## Changes

We may update this policy. The date at the top shows the latest version. If a change affects
what we collect, we will say so in the release notes.

## Contact

Questions about privacy: open an issue at
[github.com/onevcat/Prowl/issues](https://github.com/onevcat/Prowl/issues).

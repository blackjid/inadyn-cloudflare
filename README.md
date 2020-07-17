# Cloudflare Dynamic DNS backend for Inadyn

## Why?

I have a Unifi Dream Machine and I want to update my home dns when my ip changes. The Unifi controller dynamic dns service doesn't support Cloudflare as a service.
I hope this is a temporary solution as the version 2.6 of Inadyn already natively support cloudflare.

## Create and deploy the worker

We'll use cloudflares wrangler cli to build and deploy the service worker

Install wrangler

```
npm install -g @cloudflare/wrangler
```

Setup you account

```
wrangler config
```

### Deploy the worker.

You need to add your account id to the provided `wrangler.toml` file. You can get it from the Cloudflare manage worker page (on the sidebar)

Enable your workers subdomain

```
wrangler subdomain <worker-subdomain>
```

Publish the worker

```
wrangler publish
```

## Setup Unifi controller

Go to your unifi controller Dynamic Dns section and setup the following

- `service`: choose anything, it doesn't matter
- `hostname`: the name of the record you want to update (e.g. `subdomain.mydomain.com`)
- `username`: the name of the zone where the record is defined. (e.g. `mydomain.com`)
- `password`: a Cloudflare api token with `dns:edit` and `zone:read` permissions
- `server`: the Cloudflare Worker DNS plus the path `dyndns.<worker-subdomain>.workers.dev/\/update?hostname=%h&ip=%i`

> Note: you need the escaped extra slash between the hostname of your worker and the path due to a bug in the controller ui.

## Ubiquiti forums threads

There are a couple of threads on the UI forums about this. There may be other workarrounds.

- https://community.ui.com/questions/USG-support-for-Cloudflare-DDNS/878a7ca9-20c4-4dfb-b487-b9725df5a532
- https://community.ui.com/questions/Cloudflare-API-v4-DDNS-support-for-Unifi-products/96b9f134-adba-45bf-afe0-8618b141c7bb
- https://community.ui.com/questions/CloudFlare-Dynamic-DNS-on-UDM-Pro/d6c3ade4-6d4a-4df7-bfad-b17d3e8fc7ea
- https://community.ui.com/questions/Unifi-Dream-Maschine-Pro-DDNS-Problem/f0d168db-178f-4de9-9298-cc4d31649c5f#answer/89618261-51b5-4aa2-97a5-0e560d7fbdf3

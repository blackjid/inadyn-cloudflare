# Cloudflare Dynamic DNS backend for Inadyn

## Why?

I have a Unifi Dream Machine and I want to update my home dns when my ip changes. The Unifi controller dynamic dns service doesn't support Cloudflare as a service.
I hope this is a temporary solution as the version 2.6 of Inadyn already natively support cloudflare.

## Create and deploy the worker

We'll use cloudflares wrangler cli to build and deploy the service worker.

> This software will run in cloudflare edge servers, and will expose an endpoint for 
> the UDM built in support for dynamic dns. You can run this steps on your computer, it's not needed to ssh into the UDM.

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
- `server`: the Cloudflare Worker DNS plus the path `dyndns.<worker-subdomain>.workers.dev/update?hostname=%h&ip=%i`

> Note: you might need to escape an extra slash between the hostname of your worker and the path due to a bug in the controller ui.
> `dyndns.<worker-subdomain>.workers.dev/\/update?hostname=%h&ip=%i`
> At least as of UDM controller version 6.1.71 you no longer need this 

## Debugging

You can login into you UnifiOS terminal and run the following command to se how the configuration is working.

```
inadyn -1 -l debug -n -f /run/inadyn.conf
```

You can also look at the logs from the background process from the UDM

```
cat /var/log/messages | grep inadyn
```

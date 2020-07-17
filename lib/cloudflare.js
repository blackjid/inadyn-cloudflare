const Cloudflare = function(options) {
    this.cloudflare_url = 'https://api.cloudflare.com/client/v4'

    if(options.token) {
        this.token = options.token
    }

    this.findZone = async name => {
        var response = await fetch(
          `https://api.cloudflare.com/client/v4/zones?name=${name}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
          },
        )
        var body = await response.json()
        return body.result[0]
    }

    this.findRecord = async (zone, name) => {
      var response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records?name=${name}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        },
      )
      var body = await response.json()
      return body.result[0]
    }

    this.updateRecord = async (record, value) => {
      record.content = value
      var response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${record.zone_id}/dns_records/${record.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(record),
        },
      )
      var body = await response.json()
      return body.result[0]
    }
}

module.exports = Cloudflare
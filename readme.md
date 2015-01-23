## MQTT Dashboard

Concept dashboard built for [Web Research Unit](https://register.port.ac.uk/apex/f?p=111:3:0::NO::P3_UNIT_ID:372560172)

### Usage

1. Clone the repoistory
2. Set broker and subscriptions in `inc/js/main.js`. By default uses the [Mosquitto Test Broker](http://test.mosquitto.org/ws.html).
3. Run `npm install` to install dependencies
4. Run `browserify -d inc/js/main.js > inc/js/bundle.js` to bundle dependencies

[MIT License](http://rmlewisuk.mit-license.org/)

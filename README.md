# WepayAPI
Unofficial WePay's API.

## Examples

```js
const wepay_api = require("./wepay")

const device_id = "";
const device_id_md5 = "";   // (SALT required)
const device_id_sha1 = "";  // (SALT required)

(async()=>{
    var wepay = new wepay_api(device_id,device_id_md5,device_id_sha1);
    console.log(await wepay.termgameall())
})();
```

## WARNING
This project may be used only for **Educational Purposes**. Developers assume **no liability and are not responsible for any misuse or damage** caused by this program.

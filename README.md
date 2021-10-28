# WepayAPI
Unofficial WePay's API.

## Examples

```js
const wepay_api = require("./wepay")

const device_id = "";
const device_id_md5 = "";   // (SALT required)
const device_id_sha1 = "";  // (SALT required)

(async()=>{
    let wepay = new wepay_api(device_id,device_id_md5,device_id_sha1);
    console.log(await wepay.termgameall())
})();
```

## WARNING
This project may be used only for **Educational Purposes**. Developers assume **no liability and are not responsible for any misuse or damage** caused by this program.

ไม่แนะนำให้นำไปใช้โดย**เด็ดขาด** ใช้เพื่อการศึกษา**เท่านั้น**
## FUNCTIONS

### Login
```js
let username = "BossNz"
let password = "Hack me pls."
let sms = "123123"
    
var login = await wepay.login_first(username, password)
    
await wepay.login_second(login,sms)
```

## Get Profile and current point
```js
var profile = await wepay.getprofile()
console.log(profile)

var point = await wepay.get_point()
console.log(point)
```

### Show detail topup game and card
```js
var game = await wepay.termgameall()
var card = await wepay.cardall() 

console.log(game)
console.log(card)
```

### Topup game and buy card
```js
// Topup ame
let service_code = "ROV-M"
let price = "10"
let ref1 = "334009abc44f21967592ea778af28857"
let ref2 = null
var termgame = await wepay.termgame(service_code, price, ref1, ref2)
console.log(termgame)

// Buy card
let service_code = "GARENA"
let price = "150"
var termgame = await wepay.buycard(service_code, price)
console.log(termgame)

```

### Check devices and logout
```js
var devices = await wepay.device_all()
console.log(devices)

let id_device = "763976"
await wepay.delete_device(id_device)
```

### Check history and messagebox
```js
var transtion = await wepay.gettranstion(1) // 1,2,3,4
console.log(transtion)

var msbox = await wepay.getmsbox()
console.log(msbox)

```

const wepay_api = require("./wepay")

const device_id = "";
const device_id_md5 = "";   // (SALT required)
const device_id_sha1 = "";  // (SALT required)

(async()=>{
    let wepay = new wepay_api(device_id,device_id_md5,device_id_sha1);
    console.log(await wepay.termgameall())
})();
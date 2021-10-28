const crypto = require('crypto');
const axios = require('axios');
class wepay_api{
	constructor(device_id,device_id_md5,device_id_sha1){
		this.encrypted_key = "";
		this.ENC_KEY = "";
		this.IV = "";
		this.device_id = device_id;
		this.device_id_md5 = device_id_md5;
		this.device_id_sha1 = device_id_sha1;
		axios.defaults.headers.common['x-platform-os'] = 'ios';
		axios.defaults.headers.common['x-device-name'] = 'BossNzAPI';
		axios.defaults.headers.common['x-sessionid'] = device_id_sha1;
	}
	// ===========================================================
	async sendkey_exchange(){
		await axios({
			url:"https://www.wepay.in.th/mobileapp_api.v2.php",
			methods:"POST",
			data:{
				"cmd": "key_exchange",
				"encrypted_key" : this.encrypted_key
			}
		})
	}
	async login_first(username,password){
		var payloadraw = {"cmd":"login","action":"submit_form","icon":"https://static.wepay.in.th/images/app_icon/signin.png","name":"เข้าสู่ระบบสมาชิก","input_form":[{"name":"username","maxlength":20,"password":false,"title":"Username","placeholder":"Username","keyboard_type":"default","regex":"^[0-9A-Za-z]{4,20}$","otp_ref":""},{"name":"password","maxlength":20,"password":true,"title":"Password","placeholder":"Password","keyboard_type":"default","regex":"^.{8,20}$","otp_ref":""}],"addition_buttons":[{"title":"ลืมรหัสผ่าน","icon":"lock-question","color":"#00c300","action":"input_form","params":{"action":"submit_form","cmd":"forgot_password","icon":"https://static.wepay.in.th/images/app_icon/password-reset.png","name":"ลืมรหัสผ่าน","input_form":[{"name":"username","maxlength":20,"password":false,"title":"Username","placeholder":"Username","keyboard_type":"default","regex":"^[0-9A-Za-z]{4,20}$"},{"name":"identity_no","maxlength":13,"password":false,"title":"หมายเลขบัตรประจำตัวประชาชน","placeholder":"หมายเลขบัตรประจำตัวประชาชน","keyboard_type":"number-pad","regex":"^[0-9]{13}$"},{"name":"phone_no","maxlength":10,"password":false,"title":"เบอร์โทรศัพท์มือถือที่ติดต่อได้","placeholder":"เบอร์โทรศัพท์มือถือที่ติดต่อได้","keyboard_type":"number-pad","regex":"^0[689][0-9]{8}$"}],"submit_btn":{"icon":"check-circle","title":"ต่อไป"},"addition_comment":"<b>คำแนะนำ</b> ท่านจะได้รับ OTP-SMS ยืนยันการตั้งรหัสผ่านใหม่"}}],"submit_btn":{"icon":"login","title":"เข้าสู่ระบบ"},"facebook_login_sdk":{"icon":"facebook","title":"เข้าสู่ระบบด้วยบัญชี Facebook","color":"#448aff","permissions":["public_profile"],"action":"submit_form","params":{"cmd":"login"}},"addition_comment":"<b>คำแนะนำ</b> ท่านจะได้รับ OTP-SMS ยืนยันเบอร์โทรศัพท์มือถือ","inputs":{"username":{"type":"textinput","value":username,"title":"Username","title_visible":true,"contacts_btn":[]},"password":{"type":"textinput","value":password,"title":"Password","title_visible":true,"contacts_btn":[]}},"device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		return result.data.params.login_id ? result.data.params.login_id : result;
	}
	async login_second(login_id,otp){
		var payloadraw = {"cmd":"login","require_device_id":true,"start_smsretriever":true,"action":"submit_form","login_id":login_id,"icon":"https://static.wepay.in.th/images/app_icon/signin.png","name":"เข้าสู่ระบบสมาชิก","input_form":[{"name":"otp","maxlength":6,"password":false,"otp_ref":"XGMK","title":"OTP (Ref.XGMK)","placeholder":"OTP ที่ได้รับ (Ref.XGMK)","keyboard_type":"number-pad","regex":"^[0-9]{6}$"}],"submit_btn":{"icon":"login","title":"เข้าสู่ระบบ"},"addition_comment":"ระบบได้ส่ง OTP-SMS ไปยังหมายเลข <b>0954950599</b>","addition_buttons":[],"inputs":{"otp":{"type":"textinput","value":otp,"title":"OTP (Ref.XGMK)","title_visible":true,"contacts_btn":[]}},"device_id":this.device_id_md5,"device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		return result;
	}
	async termgameall(){
		var payloadraw = {"cmd":"company_selection","service":"gtopup","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		var arraygame = result.data.sections[0].data;
		var games = []
		for (var i = 0; i < arraygame.length; i++) {
			var pointbackcut = await this.cutstring('ได้รับเงินคืน','%</div>',arraygame[i].name);
			games.push({
				gamename:await this.cutstring(':bold">','</div>',arraygame[i].name),
				service_code:arraygame[i].service_code,
				pointback:isNaN(pointbackcut) ? '0%' : pointbackcut +"%"
			})
		}
		return games
	}
	async cardall(){
		var payloadraw = {"cmd":"company_selection","service":"cashcard","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload)
		var arraycard = result.data.sections[0].data;
		var cards = []
		for (var i = 0; i < arraycard.length; i++) {
			var pointbackcut = await this.cutstring('ได้รับเงินคืน','%</div>',arraycard[i].name);
			cards.push({
				cardname:await this.cutstring(':bold">','</div>',arraycard[i].name),
				service_code:arraycard[i].service_code,
				pointback:isNaN(pointbackcut) ? '0%' : pointbackcut +"%"
			})
		}
		return cards;
	}
	async termgame(service_code,price,ref,ref2 = null){
		var payloadraw = {"cmd":"submit_payment","id":"544419_"+await this.randomnumber(10),"type":"gtopup","service_code":service_code,"ref1":ref,"ref2":ref2,"price":price,"futuretrnx_timestamp":0,"pin":"","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload)
		return result
	}
	async buycard(service_code,price){
		var payloadraw = {"cmd":"submit_payment","id":"544419_"+await this.randomnumber(10),"type":"cashcard","service_code":service_code,"ref1":"0000000000","price":price,"quantity":1,"futuretrnx_timestamp":0,"pin":"","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		return result
	}
	async device_all(){
		var payloadraw = {
			cmd: 'mobile_device',
			device_id_hashed: this.device_id_sha1
		};
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload)
		var entry_ids = []
		var devices = result.data.lists[0].data
		for (var i = 0; i < devices.length; i++) {
			var name_device = await this.cutstring('Weight:bold">','</div>',devices[i].name);
			entry_ids.push({
				id_device:devices[i].id,
				name_device:name_device,
			})
		}
		return entry_ids;
	}
	async delete_device(id){
		var payloadraw = {
			cmd: 'mobile_device',
			operation: 'delete',
			entry_id: id,
			device_id_hashed: this.device_id_sha1
		}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		return result;
	}
	async gettranstion(type){
		var payloadraw = {"cmd":"transactions","type":type,"device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		if (result.data.lists == undefined) {
			return 0;
		}else{
			return result.data.lists[0].data
		}
	}
	async getmsbox(){
		var payloadraw = {"cmd":"msgbox","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		return result.data.lists[0].data
	}
	async getprofile(){
		var payloadraw = {"cmd":"get_main_menu","fcm_token":"cGvb0V7eQG27fTxfmZK5vc:APA91bEDhkBRxvAZlQTUEUC4S7cQkYRbC5nSOYWZqBU-7QJ5T0zAAaSjmOLLFJvHMkkI1EXPKC5rDM9n3fReTfPLuD_Va3mtWnM8tPO9m1qAAVMri2SZrMwx-nT3TYkfAlkooZG51I1w","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		return result.data;
	}
	async get_point(){
		var payloadraw = {"cmd":"get_main_menu","fcm_token":"cGvb0V7eQG27fTxfmZK5vc:APA91bEDhkBRxvAZlQTUEUC4S7cQkYRbC5nSOYWZqBU-7QJ5T0zAAaSjmOLLFJvHMkkI1EXPKC5rDM9n3fReTfPLuD_Va3mtWnM8tPO9m1qAAVMri2SZrMwx-nT3TYkfAlkooZG51I1w","device_id_hashed":this.device_id_sha1}
		var payload = await this.encrypt(JSON.stringify(payloadraw));
		var result = await this.sendpayload(payload);
		return (result.data.balance).replace("ยอดเงินคงเหลือ ฿", "");
	}
	// ===========================================================
	async sendpayload(payload){
		await this.sendkey_exchange()
		var result = await axios({
			url:"https://www.wepay.in.th/mobileapp_api.v2.php",
			methods:"POST",
			data:{
				"encrypted": payload
			}
		})
		if (result.data.encrypted == undefined) {
			return result.data;
		}else{
			return JSON.parse(await this.decrypt(result.data.encrypted))
		}
	}
	async randomnumber(length) {
		var result           = [];
		var characters       = '0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result.push(characters.charAt(Math.floor(Math.random() * 
				charactersLength)));
		}
		return result.join('');
	}
	async encrypt(val){
		let cipher = crypto.createCipheriv('aes-256-cbc', this.ENC_KEY, this.IV);
		let encrypted = cipher.update(val, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	}
	async decrypt(encrypted){
		let decipher = crypto.createDecipheriv('aes-256-cbc', this.ENC_KEY, this.IV);
		let decrypted = decipher.update(encrypted, 'base64', 'utf8');
		return (decrypted + decipher.final('utf8'));
	}
	async cutstring(start, end, str){    
		return str.split(start).pop().split(end)[0];
	}
}
module.exports = wepay_api
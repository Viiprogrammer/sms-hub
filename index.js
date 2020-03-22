const request = require('request')

class SMSHub  {
  constructor({url, token, timeout}) {
    this.url = url;
    this.token = token;
	this.timeout = timeout ? timeout : 2000;
  }
	
  checkErr(data) {
	const errors = ['ERROR_SQL', 'NO_NUMBERS', 'NO_BALANCE', 'WRONG_SERVICE', 'NO_BALANCE', 'WRONG_SERVICE', 'BAD_ACTION', 'BAD_ACTION', 'BAD_SERVICE', 'BAD_SERVICE', 'BAD_KEY'];
	if(errors.indexOf(data) == -1){
		return {data: data, error: false};
	} else {
		return {data: false, error: data};
	}
  }
  

   async getCurrentActivations(){
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'getCurrentActivations'}}, function (error, response, body) {
		  if(error) rej({type: 'requset'});
		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(data && !error){
			   let d = JSON.parse(data);
			   if(d.status == 'fail'){
				   resolve({data: d.msg});
			   } else if(d.status == 'success') {
				   resolve({data: d.array});
			   }
               
			} else {
			   rej({type: 'api', error: error});
			}
		  }
		});
	});
  }
  
  async setParams(service, maxPrice = 1, random = true, country = 0){
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'setMaxPrice', service: service, maxPrice: maxPrice, country: country, random: random}}, function (error, response, body) {
		  if(error) rej({type: 'requset'});
		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(!error){
               resolve();
			} else {
			   rej({type: 'api', error: error});
			}
		  }
		});
	});
  }
  
  async getNumbersStatusAndCostHubFree(){
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'getNumbersStatusAndCostHubFree'}}, function (error, response, body) {
		  if(error) rej({type: 'requset'});
		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(data && !error){
               resolve(JSON.parse(data));
			} else {
			   rej({type: 'api', error: error});
			}
		  }
		});
	});
  }
  
  async getBalance(){
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'getBalance'}}, function (error, response, body) {
		  if(error) rej({type: 'requset'});
		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(data && !error){
               resolve({balance: parseFloat(data.split(':')[1])});
			} else {
			   rej({type: 'api', error: error});
			}
		  }
		});
	});
  }
  
  async getCode(id){
	return new Promise((r, rj)=> {
		let self_class = this;
		let interval_ = setInterval(() => {
		  self_class.getStatus(id).then((d) => {
			if(d.data == 'STATUS_WAIT_CODE'){}
			
			if(d.data == 'STATUS_CANCEL'){
				clearInterval(interval_);
				rj({type: 'status', error: d.data, id: id});
			}
			
			if(d.data == 'STATUS_OK'){
				clearInterval(interval_);
				r({code: d.code, id: id});
			}
		  }).catch(err => rj(err));
		}, 1000);
	});
  }
  
  async setStatus(id, status_) {
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'setStatus', id: id, status: status_}}, function (error, response, body) {
		  if(error) rej({type: 'requset', id: id});

		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(data && !error){
               resolve({data: data});
			} else rej({type: 'api', error: error, id: id});
		  }
		});
	});
  }
  
  async getStatus(id) {
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'getStatus', id: id}}, function (error, response, body) {
		  if(error) rej({type: 'requset', id: id});
		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(data && !error){
               ((data == 'STATUS_WAIT_CODE' || data == 'STATUS_CANCEL') && resolve({data: data})) 
			   let status_ = data.split(':');
			   if(status_.length){
					switch(status_[0]){
						case 'STATUS_WAIT_RETRY':
						 resolve({data: status_[0], lastcode: status_[1], id: id}) 
						break;
						
						case 'STATUS_OK':
						 resolve({data: status_[0], code: status_[1], id: id})
						break;
					}
			   }
			}else rej({type: 'api', error: error, id: id});
		  }
		});
	});
  }
  
  async getNumber(service, country = 0) {
    return new Promise((resolve, rej) => {
		let self_class = this;
		request({url:this.url, timeout: this.timeout, qs: {api_key: this.token, action: 'getNumber', service: service, country: country}}, function (error, response, body) {
		  if(error) rej({type: 'requset', country: country, service: service});
		  if(response && response.statusCode == 200){
			let {data, error} = self_class.checkErr(body);
			if(data && !error){
				data = data.split(':');
				if(data[0] == 'ACCESS_NUMBER'){
					resolve({id: parseInt(data[1]), number: parseInt(data[2])});
				}
			}else rej({type: 'api', country: country, service: service});
		  }
		});
	});
  }
}

module.exports = SMSHub;
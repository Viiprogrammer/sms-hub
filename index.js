const request = require('request')

class SMSHub {
    constructor({url, token, timeout}) {
        this.url = url;
        this.token = token;
        this.timeout = timeout ? timeout : 2000;
    }

    checkErr(data) {
        const errors = ['ERROR_SQL', 'NO_NUMBERS', 'NO_BALANCE', 'WRONG_SERVICE', 'NO_BALANCE', 'WRONG_SERVICE', 'BAD_ACTION', 'BAD_ACTION', 'BAD_SERVICE', 'BAD_SERVICE', 'BAD_KEY'];
        if (errors.indexOf(data) === -1) {
            return {data: data, error: false};
        } else {
            return {data: false, error: data};
        }
    }


    async getCurrentActivations() {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {api_key: this.token, action: 'getCurrentActivations'}
            }, (error, response, body) => {
                if (error) reject({type: 'requset'});
                if (response && response.statusCode === 200) {
                    let {data, error} = this.checkErr(body);
                    if (data && !error) {
                        let d = JSON.parse(data);
                        if (d.status === 'fail') {
                            resolve({data: d.msg});
                        } else if (d.status === 'success') {
                            resolve({data: d.array});
                        }
                    } else {
                        reject({type: 'api', error: error});
                    }
                }
            });
        });
    }

    async setParams(service, maxPrice = 1, random = true, country = 0) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {
                    api_key: this.token,
                    action: 'setMaxPrice',
                    service: service,
                    maxPrice: maxPrice,
                    country: country,
                    random: random
                }
            }, (error, response, body) => {
                if (error) reject({type: 'requset'});
                if (response && response.statusCode === 200) {
                    let {error} = this.checkErr(body);
                    if (!error) {
                        resolve();
                    } else {
                        reject({type: 'api', error: error});
                    }
                }
            });
        });
    }

    async getNumbersStatusAndCostHubFree() {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {api_key: this.token, action: 'getNumbersStatusAndCostHubFree'}
            }, (error, response, body) => {
                if (error) reject({type: 'requset'});
                if (response && response.statusCode === 200) {
                    let {data, error} = this.checkErr(body);
                    if (data && !error) {
                        resolve(JSON.parse(data));
                    } else {
                        reject({type: 'api', error: error});
                    }
                }
            });
        });
    }

    async getBalance() {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {api_key: this.token, action: 'getBalance'}
            }, (error, response, body) => {
                if (error) reject({type: 'requset'});
                if (response && response.statusCode === 200) {
                    let {data, error} = this.checkErr(body);
                    if (data && !error) {
                        resolve({balance: data.split(':')[1]});
                    } else {
                        reject({type: 'api', error: error});
                    }
                }
            });
        });
    }

    async getCode(id) {
        return new Promise((resolve, reject) => {
            let interval_ = setInterval(() => {
                this.getStatus(id).then((response) => {
                    if (response.data === 'STATUS_WAIT_CODE') {
                    }

                    if (response.data === 'STATUS_CANCEL') {
                        clearInterval(interval_);
                        reject({type: 'status', error: response.data, id: id});
                    }

                    if (response.data === 'STATUS_OK') {
                        clearInterval(interval_);
                        resolve({code: response.code, id: id});
                    }
                }).catch(err => reject(err));
            }, 1000);
        });
    }

    async setStatus(id, status_) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {
                    api_key: this.token,
                    action: 'setStatus',
                    id: id,
                    status: status_
                }
            }, (error, response, body) => {
                if (error) reject({type: 'requset', id: id});

                if (response && response.statusCode === 200) {
                    let {data, error} = this.checkErr(body);
                    if (data && !error) {
                        resolve({data: data});
                    } else reject({type: 'api', error: error, id: id});
                }
            });
        });
    }

    async getStatus(id) {
        return new Promise((resolve, reject) => {
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {api_key: this.token, action: 'getStatus', id: id}
            }, (error, response, body) => {
                if (error) reject({type: 'requset', id: id});
                if (response && response.statusCode === 200) {
                    let {data, error} = this.checkErr(body);
                    if (data && !error) {
                        ((data === 'STATUS_WAIT_CODE' || data === 'STATUS_CANCEL') && resolve({data: data}))
                        let status_ = data.split(':');
                        if (status_.length) {
                            switch (status_[0]) {
                                case 'STATUS_WAIT_RETRY':
                                    resolve({data: status_[0], lastcode: status_[1], id: id})
                                    break;

                                case 'STATUS_OK':
                                    resolve({data: status_[0], code: status_[1], id: id})
                                    break;
                            }
                        }
                    } else reject({type: 'api', error: error, id: id});
                }
            });
        });
    }

    async getNumber(service, country = 0) {
        return new Promise((resolve, reject) => {
            let self_class = this;
            request({
                url: this.url,
                timeout: this.timeout,
                qs: {api_key: this.token, action: 'getNumber', service: service, country: country}
            }, function (error, response, body) {
                if (error) reject({type: 'requset', country: country, service: service});
                if (response && response.statusCode === 200) {
                    let {data, error} = self_class.checkErr(body);
                    if (data && !error) {
                        data = data.split(':');
                        if (data[0] === 'ACCESS_NUMBER') {
                            resolve({id: parseInt(data[1]), number: parseInt(data[2])});
                        }
                    } else reject({type: 'api', country: country, service: service});
                }
            });
        });
    }
}

module.exports = SMSHub;
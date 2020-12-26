const mocha = require('mocha');
const chai = require('chai');
const SMShub = require('./index');
const sms = new SMShub({
    url: 'http://localhost:7788',
    token: 'TOKEN'
});
var express = require('express')
var app = express()
let statusNumberInc = 0;
let statusResponseInc = 0;
let statusNumber = ['STATUS_WAIT_CODE', 'STATUS_WAIT_RETRY:98797', 'STATUS_CANCEL', 'STATUS_OK:6667'];
let statusResponse = ['ACCESS_READY', 'ACCESS_RETRY_GET', 'ACCESS_ACTIVATION', 'ACCESS_CANCEL'];
app.get('/', function (req, res) {
    if (req.query.api_key === 'TOKEN') {
        if (req.query.action === 'getNumber') {
            res.send('ACCESS_NUMBER:7788:654654')
        }
        if (req.query.action === 'getStatus' && req.query.id == 0) {
            res.send(statusNumber[statusNumberInc]);
            statusNumberInc++;
        }

        if (req.query.action === 'setStatus' && req.query.id == 0) {
            res.send(statusResponse[statusResponseInc]);
            statusResponseInc++;
        }

        if (req.query.action === 'getBalance') {
            res.send('ACCESS_BALANCE:0.566')
        }
    }
})

app.listen(7788)

const expect = chai.expect;
const errors = ['ERROR_SQL', 'NO_NUMBERS', 'NO_BALANCE', 'WRONG_SERVICE', 'NO_BALANCE', 'WRONG_SERVICE', 'BAD_ACTION', 'BAD_ACTION', 'BAD_SERVICE', 'BAD_SERVICE', 'BAD_KEY'];

describe("Error handler", function () {
    it("checkErr()", function (done) {
        for (let code of errors) {
            expect(JSON.stringify(sms.checkErr(code))).to.equal(`{"data":false,"error":"${code}"}`);
        }
        done();
    });
});
describe("operatorAndCountryChange (Change operator and country)", function () {
    it("operatorAndCountryChange()", function (done) {
            sms.operatorAndCountryChange('mtt', 0).then(({status, msg}) => {
                expect(status).to.equal('success')
                expect(msg).to.equal("Оператор успешно изменен")
                done();
            }).catch(done);
    });
});

describe("getListOfCountriesAndOperators", function () {
    it("getListOfCountriesAndOperators()", function (done) {
        sms.getListOfCountriesAndOperators().then(({status, services, data,  currentOperator, currentCountry}) => {
            console.log( currentOperator)
            expect(status).to.equal('success')
            if(services && data.length){
                done();
            }

        }).catch(done);
    });
});

describe("Balance request", function () {
    it("getBalance()", (done) => {
        sms.getBalance().then(({balance}) => {
            expect(balance).to.equal(0.566);
            done();
        }).catch(done);

    });
});
describe("Number request", function () {
    it("getNumber()", (done) => {
        sms.getNumber('vk', 0).then(({id, number}) => {
            expect(id).to.equal('7788');
            expect(number).to.equal('654654');
            done();
        }).catch(done);

    });
});
describe("Status request", function () {
    it("getStatus() STATUS_WAIT_CODE", (done) => {
        sms.getStatus(0).then(({data}) => {
            expect(data).to.equal('STATUS_WAIT_CODE');
            done();
        }).catch(done);
    });

    it("getStatus() STATUS_WAIT_RETRY", (done) => {
        sms.getStatus(0).then(({data, lastcode, id}) => {
            expect(data).to.equal('STATUS_WAIT_RETRY');
            expect(lastcode).to.equal('98797');
            expect(id).to.equal(0);
            done();
        }).catch(done);
    });

    it("getStatus() STATUS_CANCEL", (done) => {
        sms.getStatus(0).then(({data}) => {
            expect(data).to.equal('STATUS_CANCEL');
            done();
        }).catch(done);
    });

    it("getStatus() STATUS_OK", (done) => {
        sms.getStatus(0).then(({data, code, id}) => {
            expect(data).to.equal('STATUS_OK');
            expect(code).to.equal('6667');
            expect(id).to.equal(0);
            done();
        }).catch(done);
    });
});


describe("setStatus request", function () {
    it("setStatus(1) -> ACCESS_READY", (done) => {
        sms.setStatus(0, 1).then(({data}) => {
            expect(data).to.equal('ACCESS_READY');
            done();
        }).catch(done);
    });

    it("setStatus(3) -> ACCESS_RETRY_GET", (done) => {
        sms.setStatus(0, 3).then(({data}) => {
            expect(data).to.equal('ACCESS_RETRY_GET');
            done();
        }).catch(done);
    });

    it("setStatus(6) -> ACCESS_ACTIVATION", (done) => {
        sms.setStatus(0, 6).then(({data}) => {
            expect(data).to.equal('ACCESS_ACTIVATION');
            done();
        }).catch(done);
    });

    it("setStatus(8) -> ACCESS_CANCEL", (done) => {
        sms.setStatus(0, 8).then(({data}) => {
            expect(data).to.equal('ACCESS_CANCEL');
            done();
        }).catch(done);
    });
});
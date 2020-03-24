## Getting Started

### Installation

To use SMSHUB in your project, run:

```bash
npm i smshub
```

# How to use
```javascript
const SMShub = require('smshub');
const sms = new SMShub({
  url: 'https://smshub.org/stubs/handler_api.php', 
  token: 'TOKEN'
});
 
(async() => {
 //Set default price, country, and activate random number
 //Service - vk, max price - 0.67 RUB, random number - true, country - 0
 await sms.setParams('vk', 0.67, true,  0);
 //Service - vk, country - 0
 await sms.getBalance().then(async(balance) =>{
   if(balance > 0){
      sms.getNumber('vk', 0).then(async(obj) => {
        console.log('ID:', obj.id);
        console.log('Number:', obj.number);
        //Set "message has been sent" status
        sms.setStatus(obj.id, 1).then(async(x) => {
            //Wait for code
            sms.getCode(obj.id).then(async(code_obj) => {
                console.log('Code:', code_obj.code);
                sms.setStatus(code_obj.id, 6); //Accept, end
            });
        });
      });
   } else console.log('No money');
 });
})();
```
***All errors can be caught via catch***

#### getNumber(numberID, StatusCode)
- returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{id: ID, number: NUMBER}` - Success.
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', country: COUNTRY, service: SERVICE}` - Api error (error codes here https://smshub.org/main#getNumbers)
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset', country: COUNTRY, service: SERVICE}` - request 
 
#### setStatus(service, country = 0)
- returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{data: DATA}` - Success, `DATA` - status code from SMSHub
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', error: ERRORCODE, id: NUMBERID}` - Api error (error codes here https://smshub.org/main#setStatus)
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset', id: NUMBERID}` - request error

#### getCode(numberID)
- returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{code: CODE, id: NUMBERID}` - Success.
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'status', error: 'STATUS_CANCEL', id: NUMBERID}` - if number cancelled
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', error: ERRORCODE, id: NUMBERID}` - Api error (error codes here https://smshub.org/main#getStatus)
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset', id: NUMBERID}` - request error
 
  
#### getBalance()
- returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{balance: BALANCE}` - Success. BALANCE - float
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', error: ERRORCODE}` - Api error (error codes here https://smshub.org/main#getBalance)
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset'}` - request error
 
#### getNumbersStatusAndCostHubFree()
- returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) - Success.
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', error: ERRORCODE}` - Api error (error codes here https://smshub.org/main#getBalance)
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset'}` - request error
 
####  setParams(service, maxPrice, random = true, country = 0) 
- returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', error: ERRORCODE}` - Api error (error codes here https://smshub.org/main#getBalance)
 - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset'}` - request error
 
 #### getCurrentActivations()
 - returns [`<[Promise]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise): 
  - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{data: DATA}` - Success. DATA - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'api', error: ERRORCODE}` - Api error (error codes here https://smshub.org/main#getBalance)
  - [`<[Object]>`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) `{type: 'requset'}` - request error

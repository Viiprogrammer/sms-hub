## Getting Started

### Installation

To use SMSHUB in your project, run:

```bash
npm i smshub
```
or
```bash
yarn add smshub
```
[![NPM](https://nodei.co/npm/smshub.png?downloads=true&stars=true)](https://nodei.co/npm/smshub/)

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
 await sms.setParams('vk', '0.67', true,  0);
 const balance = await sms.getBalance();
 if(balance > 0){
    const {id, number} = await sms.getNumber('vk', 0);
    console.log('Number ID:', id);
    console.log('Number:', number);
    //Set "message has been sent" status
    await sms.setStatus(id, 1);
    //Wait for code
    await sms.getCode(id).then(async({id, code}) => {
       console.log('Code:', code);
       await sms.setStatus(id, 6); //Accept, end
    });   
 } else console.log('No money');
})();
```
***All errors can be caught via catch***

#### `Promise` getNumber(`service`, `country`) 
```javascript
 {id: ID, number: NUMBER} - Success.
 {type: 'api', country: COUNTRY, service: SERVICE} //Api error (error codes here https://smshub.org/main#getNumbers)
 {type: 'requset', country: COUNTRY, service: SERVICE} //Request 
``` 
#### `Promise` setStatus(`numberID`, `statusID`) 
```javascript
 {data: DATA} // Success, `DATA` - status code from SMSHub
 {type: 'api', error: ERRORCODE, id: NUMBERID} //Api error (error codes here https://smshub.org/main#setStatus)
 {type: 'requset', id: NUMBERID} //Request error
``` 
#### `Promise` getCode(`numberID`) 
```javascript
 {code: CODE, id: NUMBERID} //Success
 {type: 'status', error: 'STATUS_CANCEL', id: NUMBERID} // if number cancelled
 {type: 'api', error: ERRORCODE, id: NUMBERID} // Api error (error codes here https://smshub.org/main#getStatus)
 {type: 'requset', id: NUMBERID} //Request error
``` 
  
#### `Promise` getBalance() 
```javascript
 {balance: BALANCE} - Success. BALANCE - float
 {type: 'api', error: ERRORCODE} //Api error (error codes here https://smshub.org/main#getBalance)
 {type: 'requset'} //Request error
``` 
#### `Promise` getNumbersStatusAndCostHubFree() 
```javascript
 Object - Success.
 {type: 'api', error: ERRORCODE} //Api error (error codes here https://smshub.org/main#getBalance)
 {type: 'requset'} //Request error
``` 

#### `Promise` setParams(`service`, `maxPrice`, `random = true`, `country = 0`)
```javascript
 {type: 'api', error: ERRORCODE}// Api error (error codes here https://smshub.org/main#getBalance)
 {type: 'requset'} //Request error
``` 
#### `Promise` getCurrentActivations()
```javascript
   {data: DATA} //Success.
   {type: 'api', error: ERRORCODE} //Api error (error codes here https://smshub.org/main#getBalance)
   {type: 'requset'} //Request error
``` 

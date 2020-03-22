# How to use

## Example:
```javascript
(async() => {
 //Set default price, country, and activate random number
 //Service - vk, max price - 0.67 RUB, random number - true, country - 0
 await setParams('vk', 0.67, true,  0);
 //Service - vk, country - 0
 await getBalance().then(async(balance) =>{
   if(balance > 0){
      getNumber('vk', 0).then(async(obj) => {
        console.log('ID:', obj.id);
        console.log('Number:', obj.number);
        //Set "message has been sent" status
        setStatus(obj.id, 1).then(async(x) => {
            //Wait for code
            getCode(obj.id).then(async(code_obj) => {
                console.log('Code:', code_obj.code);
                setStatus(code_obj.id, 6); //Accept, end
            });
        });
      });
   } else console.log('No money');
 });
})();
```

# Eid module

## EidMiddleware

EidMiddleware module wrapper for Dios EidMiddleware

## Example usage

In the example repository is an example on how to use eid-middleware.

https://bitbucket.antwerpen.be/projects/AUI/repos/examples/browse/21_eid_middleware

## Initialize the middleware
---

The package puts an `eid.middleware` on the window object.

```Javascript
(function(eidMiddleware){

    new eidMiddleware()
            .initializeMiddleware()
            .then(onStatusOk, onError);

})(window.eid.middleware)
```

### **initializeMiddleware()**

This method initializes the necessary services to communicate with the middleware.

*Returns:*

A `Promise`.

### **onStatusOk**

This callback receives a `statusInfo` object which looks like this:

```json
{
    code: 0,
    app: {
        url: '..',
        version: '1.2.1'
    }
}
```

The `code` property contains the statuscode returned from the middleware.

If `app` property is on the object it means that your current version is out of date or not running.

### **onError**

This callback is triggered when the initialisation didn't recieve an `OK` and receives a `statusInfo` object which looks like this:

```json
{
    code: 0,
    app: {
        url: '..',
        version: '1.2.1'
    }
}
```

The `code` property contains the statuscode returned from the middleware.

If `app` property is on the object it means that your current version is out of date or not running.

### **StatusCodes**

All status code can be found on `window.akit.services.eid.constants.statusCodes`.
They are the following:

| Value | Constant | Meaning |
| ----- | -------- | ------- |
| 0 | OK | Everything is running and ready to communicate with. |
| 1 | SERVICE_NOT_RUNNING | The middleware is not running. |
| 2 |INTERNAL_SERVICE_ERROR | An internal error occured while trying to connect to the middleware. |
| 3 | SERVICE_OUT_OF_DATE | The middleware is out of date, but running. |
| 4 | EXTENSION_NOT_INSTALLED | The chrome extension is not installed. |
| 5 | NATIVE_APP_NOT_INSTALLED | Java applet is not installed. |
| 6 | SANDBOXED | The middleware is running sandboxed. |

## Hooking up events
---

On the `window.akit.services.eid` instance there is an `onEvent` hook where you can listen voor all the events.

```Javascript
    window.akit.services.eid.onEvent('*', onCorrectCardInserted);
```

Each event callback has his own signature, which you can find in the table below.

### **Events**

All event can be found on `window.akit.services.eid.events`.
They are the following:

| Value | Constant | Meaning | Callback signature |
| ----- | -------- | ------- | ------- |
| incorrectCardInserted | INCORRECT_CARD_INSERTED | The inserted card is incorrect. | ```fn(eventName)``` |
| cardIncorrectInserted | CARD_INCORRECT_INSERTED | The card is incorrectly inserted. | ```fn(eventName)``` |
| correctCardInserted | CORRECT_CARD_INSERTED | The card is correctly inserted. | ```fn(eventName, { eidCard , data})``` |
| correctCardRemoved | CORRECT_CARD_REMOVED | A correct card has been removed. | ```fn(eventName, { data })``` |
| incorrectInsertedCardRemoved | INCORRECT_INSERTED_CARD_REMOVED | A incorrectly inserted card has been removed. | ```fn(eventName)``` |
| incorrectCardRemoved | INCORRECT_CARD_REMOVED | An incorrect card has been removed. | ```fn(eventName)``` |
| noCardReaderFound | NO_CARD_READER_FOUND | The card reader was not found. | ```fn(eventName)``` |
| cardReaderConnected | CARD_READER_CONNECTED | A card reader connected. | ```fn(eventName, { name })``` |
| cardReaderDisconnected | CARD_READER_DISCONNECTED | A cord reader disconnected. | ```fn(eventName, { name })``` |

Next to all these events you can listen for `*` which indicate that you want to be notified on **all** events.

## Working with the eID
---

On the `CORRECT_CARD_INSERTED` event you get and eIDInstance as parameter. This instance is used to communicate with the eID card itself through the middleware.

### **readValidationData()**

This method allows the reading of all validation data required by eid_login backend.

```Javascript
    eIdInstance
        .readValidationData()
        .then(function onSuccess(data){

        }, function onError(error){

        });

```

*Returns:*

A `Promise`.
This promise has the following object if resolved. All the date is base64 encoded.

```Javascript
    {
        authenticationCertificate: ... ,
        nonRepudiationCertificate: ... ,
        rnCertificate: ... ,
        rawAddressData: ... ,
        addressDataSignature: ... ,
        rawRnData: ... ,
        rnDataSignature: ... ,
        citizenCertificate: ...
    }
```

If the promise is rejected it will contain the error where things went wrong.

### **signWithAuthenticationToken(token)**

This method creates a signed authenticated signature with the provided token.

```Javascript
    eIdInstance
        .signWithAuthenticationToken(token)
        .then(function onSuccess(signedData){

        }, function onError(error){

        });
```

*Returns:*

A `Promise`.
This promise has the signed data if resolved.

If the promise is rejected it will contain the error where things went wrong.

### **setupPinRequestFlow**

When the middleware requires the insertion of the pincode, it has a default dialog (in dutch).
You can use `setupPinRequestflow` to overwrite that dialog.

```Javascript
    eIdInstance
        .setupPinRequestFlow(
            requestCallback,
            onCorrectPin,
            onError,
            onTriesLeftUpdated
        );
```

*requestCallback*

Construct your dialog logic here. Use `checkPin` to ask the middleware to check the pinCode.

```Javascript
    ...
    requestCallback : function(checkPin, pinTriesLeft){
        // show dialog

        if(ok){
            checkPin(enteredPinCode, null);
        } else {
            var error = {
                message: 'user cancelled pin entry',
                code: 2004
            };
            checkPin(null, error);
        }
    },
    ...
```

*onCorrectPin*

This callback will be called if the pincode was correct.

```Javascript
    ...
    onCorrectPin: function(){
        // close dialog
    },
    ...
```

*onError*

This callback will be called if the pincode was incorrect.

```Javascript
    ...
    onError: function(error){
        // Display the error
    },
    ...
```

*onTriesLeftUpdated*

This callback will be called when the amount of tries changed.

```Javascript
    ...
    onTriesLeftUpdated: function(tries){
        // update ui with the remaining tries
    }
```

### **Error codes**

When working with the eIdInstance and errors return the following object structure will be returned:

```Javascript
{
    message: '...',
    code: 0000
}
```

All error codes are listed below.

#### EIdInstance Error codes

| Code | Meaning |
| ---- | ------- |
| 2000 | No card in reader |
| 2001 | Communication error (with card). |
| 2002 | Parsing error: could not interpret date from the card. |
| 2003 | Timeout occurered (e.g. pin code entry). |
| 2004 | Operation cancelled by the user (e.g. with entry of the pin code). |
| 2005 | Operation aborded (e.g. removing card while entering pin code). |
|  |  |
| 2100 | Wrong pin, 2 tries left. |
| 2101 | Wrong pin, 1 try left. |
| 2102 | Wrong pin, card blocked. |

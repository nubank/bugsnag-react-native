Object.defineProperty(exports,"__esModule",{value:true});exports.Report=exports.StandardDelivery=exports.Configuration=exports.Client=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _reactNative=require('react-native');function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var NativeClient=_reactNative.NativeModules.BugsnagReactNative;

var BREADCRUMB_MAX_LENGTH=30;var




Client=exports.Client=




function Client(apiKeyOrConfig){var _this=this;_classCallCheck(this,Client);this.






















handleUncaughtErrors=function(){
if(ErrorUtils){
var previousHandler=ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler(function(error,isFatal){
if(_this.config.autoNotify&&_this.config.shouldNotify()){
_this.notify(error,function(report){report.severity='error';},!!NativeClient.notifyBlocking,function(){
if(previousHandler){
previousHandler(error,isFatal);
}
});
}else if(previousHandler){
previousHandler(error,isFatal);
}
});
}
};this.

handlePromiseRejections=function(){
var tracking=require('promise/setimmediate/rejection-tracking'),
client=_this;
tracking.enable({
allRejections:true,
onUnhandled:function onUnhandled(id,error){client.notify(error);},
onHandled:function onHandled(){}});

};this.











notify=function _callee(error,beforeSendCallback,blocking,postSendCallback){var report,_iterator,_isArray,_i;return regeneratorRuntime.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(
error instanceof Error){_context.next=3;break;}
console.warn('Bugsnag could not notify: error must be of type Error');return _context.abrupt('return');case 3:if(


_this.config.shouldNotify()){_context.next=5;break;}return _context.abrupt('return');case 5:



report=new Report(_this.config.apiKey,error);
report.addMetadata('app','codeBundleId',_this.config.codeBundleId);_iterator=

_this.config.beforeSendCallbacks,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==='function'?typeof Symbol==='function'?typeof Symbol==='function'?Symbol.iterator:'@@iterator':'@@iterator':'@@iterator']();case 8:if(!_isArray){_context.next=14;break;}if(!(_i>=_iterator.length)){_context.next=11;break;}return _context.abrupt('break',22);case 11:callback=_iterator[_i++];_context.next=18;break;case 14:_i=_iterator.next();if(!_i.done){_context.next=17;break;}return _context.abrupt('break',22);case 17:callback=_i.value;case 18:if(!(
callback(report,error)===false)){_context.next=20;break;}return _context.abrupt('return');case 20:_context.next=8;break;case 22:



if(beforeSendCallback){
beforeSendCallback(report);
}

if(blocking){
NativeClient.notifyBlocking(report.toJSON(),blocking,postSendCallback);
}else{
NativeClient.notify(report.toJSON());
if(postSendCallback)
postSendCallback();
}case 24:case'end':return _context.stop();}}},null,_this);};this.


setUser=function(id,name,email){
NativeClient.setUser({id:id,name:name,email:email});
};this.




clearUser=function(){
NativeClient.clearUser();
};this.





leaveBreadcrumb=function(name,metadata){
if(typeof name!=='string'){
console.warn('Breadcrumb name must be a string, got \''+name+'\'. Discarding.');
return;
}

if(name.length>BREADCRUMB_MAX_LENGTH){
console.warn('Breadcrumb name exceeds '+BREADCRUMB_MAX_LENGTH+' characters (it has '+name.length+'): '+name+'. It will be truncated.');
}


if(metadata==undefined){
metadata={};
}else if(typeof metadata==='string'){
metadata={'message':metadata};
}else if(typeof metadata!=='object'){
console.warn('Breadcrumb metadata must be an object or string, got \''+metadata+'\'. Discarding metadata.');
metadata={};
}

var type=metadata['type']||'manual';
var breadcrumbMetaData=_extends({},metadata);
delete breadcrumbMetaData['type'];

NativeClient.leaveBreadcrumb({
name:name,
type:type,
metadata:typedMap(breadcrumbMetaData)});

};if(typeof apiKeyOrConfig==='string'||typeof apiKeyOrConfig==='undefined'){this.config=new Configuration(apiKeyOrConfig);}else if(apiKeyOrConfig instanceof Configuration){this.config=apiKeyOrConfig;}else{throw new Error('Bugsnag: A client must be constructed with an API key or Configuration');}if(NativeClient){NativeClient.startWithOptions(this.config.toJSON());this.handleUncaughtErrors();if(this.config.handlePromiseRejections)this.handlePromiseRejections();}else{throw new Error('Bugsnag: No native client found. Is BugsnagReactNative installed in your native code project?');}};var





Configuration=exports.Configuration=

function Configuration(apiKey){var _this2=this;_classCallCheck(this,Configuration);this.

















shouldNotify=function(){
return!_this2.releaseStage||
!_this2.notifyReleaseStages||
_this2.notifyReleaseStages.includes(_this2.releaseStage);
};this.






registerBeforeSendCallback=function(callback){
_this2.beforeSendCallbacks.push(callback);
};this.




unregisterBeforeSendCallback=function(callback){
var index=_this2.beforeSendCallbacks.indexOf(callback);
if(index!=-1){
_this2.beforeSendCallbacks.splice(index,1);
}
};this.




clearBeforeSendCallbacks=function(){
_this2.beforeSendCallbacks=[];
};this.

toJSON=function(){
return{
apiKey:_this2.apiKey,
codeBundleId:_this2.codeBundleId,
releaseStage:_this2.releaseStage,
notifyReleaseStages:_this2.notifyReleaseStages,
endpoint:_this2.delivery.endpoint,
appVersion:_this2.appVersion,
version:_this2.version};

};var metadata=require('../package.json');this.version=metadata['version'];this.apiKey=apiKey;this.delivery=new StandardDelivery();this.beforeSendCallbacks=[];this.notifyReleaseStages=undefined;this.releaseStage=undefined;this.appVersion=undefined;this.codeBundleId=undefined;this.autoNotify=true;this.handlePromiseRejections=!__DEV__;};var


StandardDelivery=exports.StandardDelivery=

function StandardDelivery(endpoint){_classCallCheck(this,StandardDelivery);
this.endpoint=endpoint||'https://notify.bugsnag.com';
};var





Report=exports.Report=

function Report(apiKey,error){var _this3=this;_classCallCheck(this,Report);this.















addMetadata=function(section,key,value){
if(!_this3.metadata[section]){
_this3.metadata[section]={};
}
_this3.metadata[section][key]=value;
};this.

toJSON=function(){
return{
apiKey:_this3.apiKey,
context:_this3.context,
errorClass:_this3.errorClass,
errorMessage:_this3.errorMessage,
groupingHash:_this3.groupingHash,
metadata:typedMap(_this3.metadata),
severity:_this3.severity,
stacktrace:_this3.stacktrace,
user:_this3.user};

};this.apiKey=apiKey;this.errorClass=error.constructor.name;this.errorMessage=error.message;this.context=undefined;this.groupingHash=undefined;this.metadata={};this.severity='warning';this.stacktrace=error.stack;this.user={};};


var allowedMapObjectTypes=['string','number','boolean'];





var typedMap=function typedMap(map){
var output={};
for(var key in map){
if(!{}.hasOwnProperty.call(map,key))continue;

var value=map[key];


if(value==undefined){
output[key]={type:'string',value:String(value)};
}else if(typeof value==='object'){
output[key]={type:'map',value:typedMap(value)};
}else{
var type=typeof value;
if(allowedMapObjectTypes.includes(type)){
output[key]={type:type,value:value};
}else{
console.warn('Could not serialize breadcrumb data for \''+key+'\': Invalid type \''+type+'\'');
}
}
}
return output;
};

//# sourceMappingURL=Bugsnag.js.map
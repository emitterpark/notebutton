const {Action,NavigationView,ScrollView,Page,Button,TextInput,TextView,Composite,AlertDialog,ActivityIndicator,ui} = require('tabris')
const Paho = require('paho-mqtt')
//////////////////////////////
let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0,
  toolbarColor: 'black'
}).appendTo(ui.contentView)
//////////////////////////////
let homePage = new Page({
  title: 'Home'  
}).appendTo(navigationView)

let logScroll = new ScrollView({
  left: 0, right: 0, top: 0, bottom: 0,
  direction: 'vertical'
}).appendTo(homePage);
//////////////////////////////
new Action({  
  image: {    
    src: 'images/menu.png',
    scale: 1
  }
}).on('select', () => {
  createSettings()
}).appendTo(navigationView)

function createSettings () {  

  let settingsPage = new Page({
    title: 'Settings'
  }).appendTo(navigationView)
  
  new TextView({
    top: 35, left:10, 
    text: 'WiFi ssid',
    textColor: 'gray', font: '16px'
  }).appendTo(settingsPage)
  
  let ssid = new TextInput({  
    top: 45, left:10, right: 10, 
    text: localStorage.getItem('ssid'), 
    font: '20px',
    borderColor: 'gray'
  }).on('textChanged', event => {
    localStorage.setItem('ssid', event.target.text)    
  }).appendTo(settingsPage)
  
  new TextView({
    top: 95, left:10,  
    text: 'WiFi password',
    textColor: 'gray', font: '16px'
  }).appendTo(settingsPage)
  
  let password = new TextInput({  
    top: 105, left:10, right: 10,
    text: localStorage.getItem('password'),  
    font: '20px',
    borderColor: 'gray'
  }).on('textChanged', event => {
    localStorage.setItem('password', event.target.text)    
  }).appendTo(settingsPage)

  new TextView({
    top: 155, left:10,
    text: 'Topic',
    textColor: 'gray', font: '16px'
  }).appendTo(settingsPage)
  
  let topic = new TextInput({  
    top: 165, left:10, right: 10,
    text: localStorage.getItem('topic'), 
    font: '20px',
    borderColor: 'gray'
  }).on('textChanged', event => {
    localStorage.setItem('topic', event.target.text)    
  }).appendTo(settingsPage)

  new TextView({
    top: 215, left:10,
    text: 'Button',
    textColor: 'gray', font: '16px'
  }).appendTo(settingsPage)
  
  let message = new TextInput({  
    top: 225, left:10, right: 10,
    text: localStorage.getItem('message'),  
    font: '20px',
    borderColor: 'gray'
  }).on('textChanged', event => {
    localStorage.setItem('message', event.target.text)    
  }).appendTo(settingsPage)

  new Button({  
    top: 290, left: 8, width: 80,
    text: 'CLEAR'
  }).on('select', event => {    
    localStorage.clear()    
  }).appendTo(settingsPage)

  new Button({  
    top: 290, left: 'prev()', width: 105,
    text: 'DOWNLOAD'
  }).on('select', event => {
    act.visible = true
    settingsPage.enabled = false
    let raceTimeout = function(ms){
      let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id)
          reject()
        }, ms)
      })
      return Promise.race([
        fetch('http://192.168.4.1/configs', {
          method: 'GET'    
        }),
        timeout
      ])
    }  
    let result = raceTimeout(5000)
    result.then(res => res.json())    
    .then(response => {      
      ssid.text = response.ssid
      password.text = response.password
      topic.text = response.topic
      message.text = response.message     
      act.visible = false
      settingsPage.enabled = true 
      new AlertDialog({
        title: 'Download',
        message: 'Configuration downloaded !',
        buttons: {ok: 'OK'}
      }).open() 
    })
    result.catch(error => {
      act.visible = false
      settingsPage.enabled = true 
      new AlertDialog({
        title: 'Download',
        message: 'Can not connect to Button !',
        buttons: {ok: 'OK'}
      }).open() 
    })
  }).appendTo(settingsPage)

  new Button({  
    top: 290, left: 'prev()', width: 80,
    text: 'UPLOAD'
  }).on('select', event => { 
    act.visible = true
    settingsPage.enabled = false 
    let sendConfigs = {}
    sendConfigs.ssid = localStorage.getItem('ssid')
    sendConfigs.password = localStorage.getItem('password')
    sendConfigs.client = 'mqtt'
    sendConfigs.ssl = 'false'
    sendConfigs.broker = 'iot.eclipse.org'
    sendConfigs.clientid = ''
    sendConfigs.topic = localStorage.getItem('topic')
    sendConfigs.message = localStorage.getItem('message')
    let raceTimeout = function(ms){
      let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id)
          reject()
        }, ms)
      })
      return Promise.race([
        fetch('http://192.168.4.1/configs', {
          method: 'POST',
          body: JSON.stringify(sendConfigs),
          headers:{'Content-Type': 'application/json'}
        }),
        timeout
      ])
    }  
    let result = raceTimeout(5000)
    result.then(res => res.json())    
    .then(response => {    
      act.visible = false
      settingsPage.enabled = true
      new AlertDialog({
        title: 'Upload',
        message: 'Configuration uploaded !',
        buttons: {ok: 'OK'}
      }).open() 
    })
    result.catch(error => {
      act.visible = false
      settingsPage.enabled = true 
      new AlertDialog({
        title: 'Upload',
        message: 'Can not connect to Button !',
        buttons: {ok: 'OK'}
      }).open() 
    })
  }).appendTo(settingsPage)

  new Button({  
    top: 290, left: 'prev()', width: 80,
    text: 'TEST'
  }).on('select', event => {
    act.visible = true
    settingsPage.set('enabled', false)
    let sendConfigs = {'test':'true'}
    let raceTimeout = function(ms){
      let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id)
          reject()
        }, ms)
      })
      return Promise.race([
        fetch('http://192.168.4.1/configs', {
          method: 'POST',
          body: JSON.stringify(sendConfigs),
          headers:{'Content-Type': 'application/json'}
        }),
        timeout
      ])
    }  
    let result = raceTimeout(5000)
    result.then(res => res.json())    
    .then(response => {
      act.visible = false
      settingsPage.enabled = true 
      new AlertDialog({
        title: 'Test',
        message: 'Test request sent !',
        buttons: {ok: 'OK'}
      }).open() 
    })
    result.catch(error => {
      act.visible = false
      settingsPage.enabled = true 
      new AlertDialog({
        title: 'Test',
        message: 'Can not connect to Button !',
        buttons: {ok: 'OK'}
      }).open()    
    })
  }).appendTo(settingsPage)

  let act = new ActivityIndicator({
    top: 20, right: 20,
    width: 50, height: 50,
    visible: false 
  }).appendTo(settingsPage)

}
//////////////////////////////
let unread = new TextView({  
  top: 15, right: 60, width: 50,
  background: 'red', cornerRadius: 5,  
  text: 0, textColor: 'white',
  alignment: 'center', font: '20px'  
}).appendTo(ui.contentView)
//////////////////////////////
let mqtt = new Paho.Client('iot.eclipse.org', 80, '/ws', '')
mqtt.onMessageArrived = onMessageArrived
function onMessageArrived(message) {
  console.log('from:', message.destinationName, message.payloadString) 
  let opcode = (message.payloadString).split('-')[0]
  let logId = (message.payloadString).split('-')[1]
  let logTopic = message.destinationName  
  if (opcode == 'read') {
    logScroll.find('#'+logId).set('background', 'rgba(0, 0, 255, 0.1)')
    unread.text = Number(unread.text) - 1
  } else if (opcode == 'unread') {
    logScroll.find('#'+logId).set('background', 'rgba(255, 0, 0, 0.3)')
    unread.text = Number(unread.text) + 1
  } else if (opcode == 'dispose') {
    if (logScroll.find('#'+logId).get('background') == 'rgba(255, 0, 0, 0.3)') {
      unread.text = Number(unread.text) - 1 
    }    
    logScroll.find('#'+logId).dispose()
  } else {
    let logButton = opcode
    createLog(logId, logButton, logTopic)
    unread.text = Number(unread.text) + 1
    cordova.plugins.notification.local.schedule({
      title: logTopic,
      text: logButton,
      foreground: true,
      vibrate: true     
    })
  }  
}
function createLog(logId, logButton, logTopic) {   
  let logDate = new Date() 
  let logelapsedn = 0
  let logread = false
  let log = new Composite({
    id: logId,
    top: 'prev() 10', centerX: 0, width: 300, height: 90,
    background: 'rgba(255, 0, 0, 0.3)', cornerRadius: 10  
  }).on('longpress', event => {
    if (event.state == 'start') {
      logread = !logread
      if (logread) {
        //event.target.set('background', 'rgba(0, 0, 255, 0.1)')
        mqtt.send(logTopic, 'read' + '-' + logId)
      } else {
        //event.target.set('background', 'rgba(255, 0, 0, 0.3)')
        mqtt.send(logTopic, 'unread' + '-' + logId)
      }    
    }
  }).on('pan', event => {
    if (event.state == 'change') {
      if (Math.abs(event.translationX) > screen.width / 2) {
        clearInterval(logelapsed)
        if (event.target.background == 'rgba(255, 0, 0, 0.3)') {
          unread.text = Number(unread.text) - 1
        }
        event.target.dispose()
        mqtt.send(logTopic, 'dispose' + '-' + logId)        
      } else {
      event.target.set('transform', {translationX: event.translationX})
      }
    } else if (event.state == 'end') {
      event.target.set('transform', {translationX: 0})
    }
  }).appendTo(logScroll)
  new TextView({
    id: 'logelapsedtext',
    top: 5, centerX: 80,
    text: logelapsedn + 'm',
    alignment: 'left'
  }).appendTo(log)
  new TextView({
    top: 5, centerX: 0,
    text: logDate.toLocaleDateString(),
    alignment: 'center', textColor: 'gray'
  }).appendTo(log)
  new TextView({
    top: 20, centerX: 0,
    text: logDate.toLocaleTimeString().split(' ')[0],
    alignment: 'center', textColor: 'gray'    
  }).appendTo(log)
  new TextView({
    top: 35, centerX: 0,
    text: logTopic,
    alignment: 'center', textColor: 'gray'
  }).appendTo(log) 
  new TextView({
    top: 50, centerX: 0,
    text: logButton,
    alignment: 'center', font: '24px'
  }).appendTo(log)    
  let logelapsed = setInterval(() => {
    if (logelapsedn >= 59) {
      log.find('#logelapsedtext').set('text', '1h+')
      clearInterval(logelapsed)
    } else {
    logelapsedn += 1
    log.find('#logelapsedtext').set('text', logelapsedn + 'm')
    }
  }, 60000)
}

mqttConnect()
function mqttConnect() {   
  mqtt.connect({onSuccess:onConnect})
  function onConnect() {
    mqtt.subscribe(localStorage.getItem('topic'))      
  }
}
const {Action,NavigationView,Page,Button,TextInput,TextView,Composite,AlertDialog,ActivityIndicator,ui} = require('tabris')
const Paho = require('paho-mqtt')
let mqtt = new Paho.Client('iot.eclipse.org', 80, '/ws', "notebuttonapp")

let configs = {'ssid':'','password':'','client':'mqtt','ssl':'false',
              'broker':'iot.eclipse.org','clientid':'notebutton','topic':'','message':''}
const urlConfigs = 'http://192.168.4.1/configs'

configs.ssid = localStorage.getItem('ssid')
configs.password = localStorage.getItem('password')
configs.topic = localStorage.getItem('topic')
configs.message = localStorage.getItem('message')

mqtt.onMessageArrived = onMessageArrived
function onMessageArrived(message) {
  console.log('from:', message.destinationName, message.payloadString);
}
mqttConnect()
function mqttConnect() {   
  mqtt.connect({onSuccess:onConnect})
  function onConnect() {
    mqtt.subscribe(configs.topic)  
  }
}
//////////////////////////////
let navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView)
//////////////////////////////
let homePage = new Page({
  title: 'Home'  
}).appendTo(navigationView)
//////////////////////////////
new Action({
  //title: 'Settings',
  image: {
    src: device.platform === 'iOS' ? 'resources/share-black-24dp@3x.png' : 'resources/share-white-24dp@3x.png',
    scale: 3
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
    text: 'SSID',
    font: '16px'
  }).appendTo(settingsPage)
  
  let ssid = new TextInput({  
    top: 45, left:10, right: 10, 
    text: configs.ssid, 
    font: '20px'
  }).on('textChanged', event => {
    configs.ssid = event.target.text    
  }).appendTo(settingsPage)
  
  new TextView({
    top: 95, left:10,  
    text: 'Password',
    font: '16px'
  }).appendTo(settingsPage)
  
  let password = new TextInput({  
    top: 105, left:10, right: 10,
    text: configs.password,  
    font: '20px'
  }).on('textChanged', event => {
    configs.password = event.target.text    
  }).appendTo(settingsPage)

  new TextView({
    top: 155, left:10,
    text: 'Topic',
    font: '16px'
  }).appendTo(settingsPage)
  
  let topic = new TextInput({  
    top: 165, left:10, right: 10,
    text: configs.topic,  
    font: '20px'
  }).on('textChanged', event => {
    configs.topic = event.target.text    
  }).appendTo(settingsPage)

  new TextView({
    top: 215, left:10,
    text: 'Button',
    font: '16px'
  }).appendTo(settingsPage)
  
  let message = new TextInput({  
    top: 225, left:10, right: 10,
    text: configs.message,  
    font: '20px'
  }).on('textChanged', event => {
    configs.message = event.target.text    
  }).appendTo(settingsPage)

  let clear = new Button({  
    top: 290, left: 8, width: 80,
    text: 'CLEAR'
  }).on('select', event => {    
    clearall()    
  }).appendTo(settingsPage)

  function clearall() {
    ssid.text = ''
    password.text = ''
    topic.text = ''
    message.text = ''   
  }

  let download = new Button({  
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
        fetch(urlConfigs, {
          method: 'GET'    
        }),
        timeout
      ])
    }  
    let result = raceTimeout(5000)
    result.then(res => res.json())    
    .then(response => {      
      clearall()
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

  let upload = new Button({  
    top: 290, left: 'prev()', width: 80,
    text: 'UPLOAD'
  }).on('select', event => { 
    act.visible = true
    settingsPage.enabled = false 
    let sendConfigs = {}
    sendConfigs.ssid = configs.ssid
    sendConfigs.password = configs.password
    sendConfigs.topic = configs.topic
    sendConfigs.message = configs.message
    let raceTimeout = function(ms){
      let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id)
          reject()
        }, ms)
      })
      return Promise.race([
        fetch(urlConfigs, {
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

  let test = new Button({  
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
        fetch(urlConfigs, {
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
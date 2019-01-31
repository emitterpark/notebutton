const {Button, TextInput, TextView, Composite, RadioButton, CheckBox, AlertDialog, ActivityIndicator, ui} = require('tabris')

ui.statusBar.background = 'black'
ui.contentView.background = 'black'

let configs = {'ssid':'','password':'','client':'mail','ssl':'false',
              'broker':'','clientid':'','topic':'','message':'',
              'url':'','content':'form','key1':'','value1':'','key2':'','value2':'','key3':'','value3':'',
              'from':'','pass':'','to':'','subject':'','body':''
              }
const urlConfigs = 'http://192.168.4.1/configs'
let keyboard = false

let mainComposite = new Composite({  
  centerY: 0,
  left: 0,
  right: 0,
  height: screen.height  
}).appendTo(ui.contentView)
//////////////////////////////
let act = new ActivityIndicator({
  centerX: 0,
  centerY: 0,
  visible: false
}).appendTo(mainComposite)
//////////////////////////////
new TextView({
  bottom: 590,
  right: 10,
  text: 'IoTButton',
  textColor: 'gray',
  font: '20px'
}).appendTo(mainComposite)
//////////////////////////////
let wifiComposite = new Composite({  
  bottom: 450,
  left: 10,
  right: 10,
  height: 150   
}).appendTo(mainComposite)

new TextView({
  text: 'WiFi',
  textColor: 'gray',
  font: '20px'
}).appendTo(wifiComposite)

new TextView({
  top: 35,  
  text: 'SSID',
  textColor: 'gray',
  font: '16px'
}).appendTo(wifiComposite)

let ssid = new TextInput({  
  top: 45,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.ssid = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = 135   
}).appendTo(wifiComposite)

new TextView({
  top: 95,  
  text: 'Password',
  textColor: 'gray',
  font: '16px'
}).appendTo(wifiComposite)

let password = new TextInput({  
  top: 105,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.password = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = 135  
}).appendTo(wifiComposite)
//////////////////////////////
let clientComposite = new Composite({  
  bottom: 400,
  left: 10,
  right: 10,
  height: 40 
}).appendTo(mainComposite)

let mail = new RadioButton({
  top: 10,
  left: 0,
  checked: true,
  text: 'MAIL',
  textColor: 'gray',
  tintColor: 'gray',
  font: '16px'
}).on('checkedChanged', event => {
  if (event.value) {
    configs.client = 'mail'
    mailComposite.visible = true
    mqttComposite.visible = false
    restComposite.visible = false
    ssl.visible = false
    content.visible = false
  }
}).appendTo(clientComposite)  

let mqtt = new RadioButton({
  top: 10,
  left: 65,
  checked: false,
  text: 'MQTT',
  textColor: 'gray',
  tintColor: 'gray',
  font: '16px'
}).on('checkedChanged', event => {
  if (event.value) {
    configs.client = 'mqtt'
    mailComposite.visible = false
    mqttComposite.visible = true
    restComposite.visible = false 
    ssl.visible = true
    content.visible = false
  } 
}).appendTo(clientComposite)

let rest = new RadioButton({
  top: 10,
  left: 140,
  checked: false,
  text: 'REST',
  textColor: 'gray',
  tintColor: 'gray',
  font: '16px'
}).on('checkedChanged', event => {
  if (event.value) {
    configs.client = 'rest'
    mailComposite.visible = false
    mqttComposite.visible = false
    restComposite.visible = true 
    ssl.visible = true
    content.visible = true
  }
}).appendTo(clientComposite)

let ssl = new CheckBox({
  top: 10,
  left: 210,
  checked: false,
  visible: false,
  text: 'SSL',
  textColor: 'gray',
  tintColor: 'gray',
  font: '16px'
}).on('checkedChanged', event => {
  configs.ssl = event.value ? 'true' : 'false'
  mqttPort.text = event.value ? '8883' : '1883'
  urlName.text = event.value ? 'https://' : 'http://'  
  restPort.text = event.value ? '443' : '80' 
}).appendTo(clientComposite)

let content = new CheckBox({
  top: 10,
  left: 265,
  checked: false,
  visible: false,
  text: 'JSON',
  textColor: 'gray',
  tintColor: 'gray',
  font: '16px'
}).on('checkedChanged', event => {
  configs.content = event.value ? 'json' : 'form'
}).appendTo(clientComposite)
//////////////////////////////
let mailComposite = new Composite({
  visible: true,  
  bottom: 80,
  left: 10,
  right: 10,
  height: 310
}).appendTo(mainComposite)

new TextView({
  top: 10,  
  text: 'From (gmail address)',
  textColor: 'gray',
  font: '16px'
}).appendTo(mailComposite)

let from = new TextInput({  
  top: 20,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.from = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mailComposite)

new TextView({
  top: 70,  
  text: 'Password (gmail password)',
  textColor: 'gray',
  font: '16px'
}).appendTo(mailComposite)

let pass = new TextInput({  
  top: 80,
  left: 0,
  right: 0,
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.pass = event.target.text 
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mailComposite)

new TextView({
  top: 130,  
  text: 'To',
  textColor: 'gray',
  font: '16px'
}).appendTo(mailComposite)

let to = new TextInput({  
  top: 140,
  left: 0,
  right: 0,
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.to = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mailComposite)

new TextView({
  top: 190,  
  text: 'Subject',
  textColor: 'gray',
  font: '16px'
}).appendTo(mailComposite)

let subject = new TextInput({  
  top: 200,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.subject = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mailComposite)

new TextView({
  top: 250,  
  text: 'Body',
  textColor: 'gray',
  font: '16px'
}).appendTo(mailComposite)

let body = new TextInput({  
  top: 260,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.body = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mailComposite)
//////////////////////////////
let mqttComposite = new Composite({
  visible: false,  
  bottom: 80,
  left: 10,
  right: 10,
  height: 310
}).appendTo(mainComposite)

new TextView({
  top: 10,  
  text: 'Broker',
  textColor: 'gray',
  font: '16px'
}).appendTo(mqttComposite)

let broker = new TextInput({  
  top: 20,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.broker = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mqttComposite)

new TextView({
  top: 70,  
  text: 'Port',
  textColor: 'gray',
  font: '16px'
}).appendTo(mqttComposite)

let mqttPort = new TextInput({  
  top: 80,
  left: 0,
  right: 0,
  text: '1883',
  editable: false,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mqttComposite)

new TextView({
  top: 130,  
  text: 'ClientId',
  textColor: 'gray',
  font: '16px'
}).appendTo(mqttComposite)

let clientId = new TextInput({  
  top: 140,
  left: 0,
  right: 0,
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.clientid = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mqttComposite)

new TextView({
  top: 190,  
  text: 'Topic',
  textColor: 'gray',
  font: '16px'
}).appendTo(mqttComposite)

let topic = new TextInput({  
  top: 200,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.topic = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mqttComposite)

new TextView({
  top: 250,  
  text: 'Message',
  textColor: 'gray',
  font: '16px'
}).appendTo(mqttComposite)

let message = new TextInput({  
  top: 260,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.message = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(mqttComposite)
//////////////////////////////
let restComposite = new Composite({
  visible: false,  
  bottom: 80,
  left: 10,
  right: 10,
  height: 310 
}).appendTo(mainComposite)

let urlName = new TextView({
  top: 10,  
  text: 'http://',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let url = new TextInput({  
  top: 20,
  left: 0,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.url = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 70,  
  text: 'Port',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let restPort = new TextInput({  
  top: 80,
  left: 0,
  right: 0,
  text: '80',  
  editable: false,
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 130,  
  text: 'Key1',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let key1 = new TextInput({  
  top: 140,
  left: 0,
  right: 180,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.key1 = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 130,
  left: 170,  
  text: 'Value1',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let value1 = new TextInput({  
  top: 140,
  left: 170,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.value1 = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 190,  
  text: 'Key2',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let key2 = new TextInput({  
  top: 200,
  left: 0,
  right: 180,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.key2 = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 190,
  left: 170,  
  text: 'Value2',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let value2 = new TextInput({  
  top: 200,
  left: 170,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.value2 = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 250,  
  text: 'Key3',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let key3 = new TextInput({  
  top: 260,
  left: 0,
  right: 180,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.key3 = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)

new TextView({
  top: 250,
  left: 170,  
  text: 'Value3',
  textColor: 'gray',
  font: '16px'
}).appendTo(restComposite)

let value3 = new TextInput({  
  top: 260,
  left: 170,
  right: 0,  
  textColor: 'white',
  borderColor: 'gray',
  font: '20px'
}).on('textChanged', event => {
  configs.value3 = event.target.text    
}).on('tap', event => {
  mainComposite.centerY = -60  
}).appendTo(restComposite)
//////////////////////////////
let reset = new Button({  
  top: 560,
  left: 8,
  width: 80,
  cornerRadius: 10,
  text: 'RESET'
}).on('select', event => {    
  resetall()    
}).appendTo(mainComposite)

function resetall() {
  ssid.text = ''
  password.text = ''
  mail.checked = true
  mqtt.checked = false
  rest.checked = false
  ssl.checked = false
  content.checked = false
  from.text = ''
  pass.text = ''
  to.text = ''
  subject.text = ''
  body.text = ''
  broker.text = ''
  mqttPort.text = '1883'
  clientId.text = ''
  topic.text = ''
  message.text = ''
  url.text = ''
  urlName.text = 'http://'
  restPort.text = '80'
  key1.text = ''
  value1.text = ''
  key2.text = ''
  value2.text = ''
  key3.text = ''
  value3.text = ''   
}

let download = new Button({  
  top: 560,
  left: 'prev()',
  width: 105,
  cornerRadius: 10,  
  text: 'DOWNLOAD'
}).on('select', event => {
  act.visible = true
  mainComposite.enabled = false
  let raceTimeout = function(ms){
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
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
    resetall()
    ssid.text = response.ssid
    password.text = response.password
    if (response.client == 'mail') {
      from.text = response.from
      pass.text = response.pass
      to.text = response.to
      subject.text = response.subject
      body.text = response.body
      mail.checked = true
      mqtt.checked = false
      rest.checked = false
    } else if (response.client == 'mqtt') {
      broker.text = response.broker
      clientId.text = response.clientid
      topic.text = response.topic
      message.text = response.message
      mail.checked = false
      mqtt.checked = true
      rest.checked = false
      if (response.ssl == 'true') {
        ssl.checked = true
      } else if (response.ssl == 'false') {
        ssl.checked = false
      }
    } else if (response.client == 'rest') {
      url.text = response.url
      key1.text = response.key1
      value1.text = response.value1
      key2.text = response.key2
      value2.text = response.value2
      key3.text = response.key3
      value3.text = response.value3
      mail.checked = false
      mqtt.checked = false
      rest.checked = true
      if (response.ssl == 'true') {
        ssl.checked = true
      } else if (response.ssl == 'false') {
        ssl.checked = false
      }
      if (response.content == 'json') {
        content.checked = true
      } else if (response.content == 'form') {
        content.checked = false
      }      
    } 
    act.visible = false
    mainComposite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Configuration downloaded !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    mainComposite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open() 
  })
}).appendTo(mainComposite)

let upload = new Button({  
  top: 560,
  left: 'prev()',
  width: 80,
  cornerRadius: 10,  
  text: 'UPLOAD'
}).on('select', event => { 
  act.visible = true
  mainComposite.enabled = false 
  let sendConfigs = {}
  sendConfigs.ssid = configs.ssid
  sendConfigs.password = configs.password
  sendConfigs.client = configs.client
  if (configs.client == 'mail') {
    sendConfigs.from = configs.from
    sendConfigs.pass = configs.pass
    sendConfigs.to = configs.to
    sendConfigs.subject = configs.subject
    sendConfigs.body = configs.body
  } else if (configs.client == 'mqtt') {
    sendConfigs.ssl = configs.ssl
    sendConfigs.broker = configs.broker
    sendConfigs.clientId = configs.clientid
    sendConfigs.topic = configs.topic
    sendConfigs.message = configs.message
  } if (configs.client == 'rest') {
    sendConfigs.ssl = configs.ssl
    sendConfigs.content = configs.content
    sendConfigs.url = configs.url
    sendConfigs.key1 = configs.key1
    sendConfigs.value1 = configs.value1
    sendConfigs.key2 = configs.key2
    sendConfigs.value2 = configs.value2
    sendConfigs.key3 = configs.key3
    sendConfigs.value3 = configs.value3
  } 
  let raceTimeout = function(ms){
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
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
    mainComposite.enabled = true
    new AlertDialog({
      title: 'Test',
      message: 'Configuration uploaded !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    mainComposite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open() 
  })
}).appendTo(mainComposite)

let test = new Button({  
  top: 560,
  left: 'prev()',
  width: 80,
  cornerRadius: 10,  
  text: 'TEST'
}).on('select', event => {
  act.visible = true
  mainComposite.enabled = false
  let sendConfigs = {'test':'true'}
  let raceTimeout = function(ms){
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
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
    mainComposite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Test request sent !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    mainComposite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open()    
  })
}).appendTo(mainComposite)
//////////////////////////////
ui.contentView.on('resize', event => {   
  if (!keyboard) {
    mainComposite.centerY = 0    
  }
  keyboard = !keyboard 
})
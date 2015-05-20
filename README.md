# SFzWidget
Widget to integrate into sites using servicefriendz

See below instructions for Widget
How to setup
Dependency:
  jQuery
  IntlTelInput

Getting Started:
Link the stylesheet
```javascript
	<!-- Intl Tel Input core CSS -->
	<link rel="stylesheet" href="../assets/css/intlTelInput.css">
		
	<!-- SFz Widget CSS -->
	<link rel="stylesheet" href="../css/widget2.css">
	<link rel="stylesheet" href="../css/<theme>.widget2.css">
```
Add the plugin script and initialize it on your element

```javascript
  <div id="mySFzWidget"></div>

	<!-- jQuery Version 1.11.1 -->
	<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
	
	<!-- Intl Tel Input -->
	<script src="../assets/js/intlTelInput.min.js" ></script>	

	<!-- SFz Widget -->	
	<script src="../js/iffWidget2.js" ></script>
	
	<!-- Initialize it on your element -->	
  <script>
    $("#sfzWidget").iffWidget();
  </script>
```

Options:
  custom, type object default: bottom is 0px, left is 0px

Example:
```javascript
  custom : {
    bottom: '20px',
    left: '30px'
  }
```

theme, type: string, default: sfz, the 

Example:
```javascript
  theme : '<theme name>'
```

helpOnGo, type: object, default: is set to a image

Example:
```javascript
  helpOnGo: {
		image: null,
		label: 'Ask me anything',
	}
```

required, type: array, default: ['ALL'], valid values: 'WhatsApp', 'LiveChat', 'SMS', 'Facebook', 'Mail' and custom value in the items object.

Example:
```javascript
  required : ['SMS', 'WhatsApp', 'Facebook']
```

items, type object, default: basic setup for  'WhatsApp', 'LiveChat', 'SMS', 'Facebook', 'Mail'

Example:
```javascript
  items: {
    'WhatsApp' : {
			needContactForm: true,
			image: 'w-whatsapp.png',
			description: 'WhatsApp',
			formDetails: {
			    image: 'winIcon-whatsapp.png',
				label: 'whatsapp us at this number',
				name: 'Contact Name',
				number: '1234567890'
			}
    },
    'SMS' : {
			needInputForm: true,
			image: 'w-sms.png',
			description: 'SMS',
			formDetails: {
				label: 'Enter your mobile number to text with us now',
				url: 'https://login.servicefriendz.com/iff/sms/<company name>/',
				confirmation: "Thanks! We will be in touch shortly."
			}
	},
	'Facebook' : {
	        needNewWindow: true,
			windowSize: "height=500,width=750",
			url: 'https://www.facebook.com/messages/',
			image: 'w-facebook.png',
			description: 'facebook'
		}, 
```

Country support:

Example: 
```javascript
  getHostIp(function(data) {
    if (data.ip) {
      $('#sfzWidget').iffWidget({
        custom: {
          bottom: '0px'
        },
        required: ['WhatsApp', 'LiveChat', 'SMS', 'Facebook']
      });
    } else {
      $('#sfzWidget').iffWidget({
        required: ['WhatsApp', 'SMS']
      });
    }
});
```
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
  position, type object default: bottom is 0px, left is 0px.  User can position the widget by setting bottom and left positions.

Example:
```javascript
  position : {
    bottom: '20px',
    left: '30px'
  }
```

theme, type: string, default: sfz. User can provide its own css with the prefix as theme value.

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
			needInputForm: false,
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
			needContactForm: false,
			image: 'w-sms.png',
			description: 'SMS',
			formDetails: {
				location: '<location>',
				label: 'Enter your mobile number to text with us now',
				url: 'https://login.servicefriendz.com/iff/sms/<company name>/',
				confirmation: 'Thanks! We will be in touch shortly.',
				error: 'Unexpected error occurred. Please try to reload the page.'
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

when needContactForm option is selected (i.e. needContactForm is set to true) then a contact form will appear which allow the user to add the phone number to his/her contact list when user click on an item.  the following are the parameters for formDetails:
	image  - the image that will display in the contact form, dimension: 48px x 48px.
	label  - the greeting message.
	name   - when a client click the contact button from iPhone, then a vCard will base on this name to generate.
	number - the contact number.

when needInputForm option is selected (i.e. needInputForm is set to true) then an input form will appear which allow the user to enter his/her phone number to receive an SMS message which user click on an item.  The following are the parameters for formDetails:
	location 	 - location details that will pass to server.
	label    	 - the greeting message.
	url      	 - URL provide by Servicefriendz.
	confirmation - message for confirmation when the number successfully send to Servicefriendz's server.
	error        - message for error when the request cannot retrieve by Servicefriendz's server.
	
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
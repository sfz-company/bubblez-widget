;(function($, window, document, undefined) {
	
	function Iff(element, options) {
		
		/**
		 * Current options set by the caller including defaults.
		 * @public
		 */
		this.options = $.extend(true, {}, Iff.Defaults, options);
				
		/**
		 * Plugin element.
		 * @public
		 */
		this.$element = $(element);
		
		this.$body = $('body');
		
		this.$intlTelInput = null;
			
		this.initialize();
	}
	
	Iff.Defaults = {
			required: ['ALL'],
			postion: {
				bottom: '0',
				left: '0'
			},
			theme: 'sfz',
			helpOnGo: {
				image: 'HelpOnGo-button.png',
				label: ''
			},
			items: { 
				'Facebook' : {
					needNewWindow: true,
					url: 'https://www.facebook.com/messages/whateverphones',
					image: 'w-facebook.png',
					description: 'facebook',
					windowSize: "height=500,width=750"
				}, 
				'WhatsApp' : {
					needContactForm: true,
					image: 'w-whatsapp.png',
					description: 'WhatsApp',
					formDetails: {
						image: 'winIcon-whatsapp.png',
						label: 'whatsapp us at this number',
						name: null,
						number: null,
						linkDesc: 'add us to your contacts',
						url: null
					}
				}, 
				'SMS' : {
					needInputForm: true,
					image: 'w-sms.png',
					description: 'SMS',
					formDetails: {
						location: null,
						label: 'Enter your mobile number to text with us now',
						url: 'https://login.servicefriendz.com/sms/sfz/',
						confirmation: 'Thank you. you will receive a message in a sec :)',
						error: 'Unexpected error occurred. Please try to reload the page.'
					}
				},
				'LiveChat' : {
					image: 'w-LC.png',
					description: 'Live Chat'
				},
				'Mail' : {
					image: 'w-Email.png',
					description: 'Mail'
				}
			}
		};
		
	
	/**
	 * Initializes the carousel.
	 * @protected
	 */
	Iff.prototype.initialize = function() {
		
		function formatPhone(phone) {
	        if (!phone) { return ''; }

	        var value = phone.toString().trim().replace(/^\+/, '');

	        if (value.match(/[^0-9]/)) {
	            return phone;
	        }

	        var country, city, number;

	        switch (value.length) {
	            case 10: // +1PPP####### -> C (PPP) ###-####
	                country = 1;
	                city = value.slice(0, 3);
	                number = value.slice(3);
	                break;

	            case 11: // +CPPP####### -> CCC (PP) ###-####
	                country = value[0];
	                city = value.slice(1, 4);
	                number = value.slice(4);
	                break;

	            case 12: // +CCCPP####### -> CCC (PP) ###-####
	                country = value.slice(0, 3);
	                city = value.slice(3, 5);
	                number = value.slice(5);
	                break;

	            default:
	                return phone;
	        }

	        if (country === 1) {
	            country = '';
	        }

	        number = number.slice(0, 3) + '.' + number.slice(3);
	        return ('+' + country + '.' + city + '.' + number).trim();
	    }
		
		function createVCard() {
		    var start = "BEGIN:VCARD\nVERSION:4.0";
		    var end = "END:VCARD";
		    var data = "";

		    var init = function() {
		        data = "";
		    };

		    var name = function (surname, lastname) {
		        data += "N:" + lastname + ';' + surname + ';;;';
		        data += "\n";
		    };

		    var work = function (work) {
		        data += "TEL;TYPE=work,voice;VALUE=uri:tel:" + formatPhone(work).replace(/\./g, '-');
		        data += "\n";
		    };

		    var email = function (email) {
		        data += "EMAIL:" + email;
		        data += "\n";
		    };

		    var get = function () {
		        return start + '\n' + data + end;
		    };

		    return {
		        init:init,
		        name:name,
		        work:work,
		        email:email,
		        get:get
		    }
		}
		
		function mobileCheck() {
			return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
		}
		
		function isIPhone() {
			return (/iPhone|iPad|iPod/i.test(navigator.userAgent));
		}
		
		function validateInput() {
			var phoneNumber = iwFormHolder.find('#phoneNumber');
			if (phoneNumber.val().length === 0) {
				return false;
			}
			return true;
		}
		
		function hideInputForm(component) {
			var iwFormHolder = component.find('.iw-form-holder');
			iwFormHolder.removeClass('iw-opened-nav');
			iwFormHolder.css({
				'bottom': '0',
				'left': '0'
			});
			iwFormHolder.attr({
				'data-index': '-1'
			});
		}
		
		function showInputForm(component, index, size, formType, formDetails) {
			var iwFormHolder = component.find('.iw-form-holder');
			iwFormHolder.find('.iw-form').off('submit');
			iwFormHolder.addClass('iw-opened-nav');
			
			if (formType === 'input') {
				iwFormHolder.find('.iw-form').css({'overflow': 'visible'});
				iwFormHolder.find('.iw-form-input').css({'display': 'block'});
				iwFormHolder.find('.iw-form-contact').css({'display': 'none'});
				
				var dialCode = '';
				if (countryCode.intlTelInput('getSelectedCountryData').dialCode !== undefined) {
					dialCode = '+' + countryCode.intlTelInput('getSelectedCountryData').dialCode;
				} else {
					dialCode = '+1';
					countryCode.intlTelInput('setNumber', '+1');
				}
					
				iwFormHolder.find('.iw-form-greeting').text(formDetails.confirmation);
				iwFormHolder.find('#inputLabel').text(formDetails.label);
				iwFormHolder.find('#countryCode').val(dialCode);
				iwFormHolder.find('#phoneNumber').val('');
				iwFormHolder.find('#phoneNumber').focus();
				iwFormHolder.find('.iw-form').submit(function(evt) {
					if (!validateInput()) {
						if (mobileCheck() === true) {
							component.css({'display': 'none'});
						}
						window.setTimeout(function () {
							if (mobileCheck() === true) {
								component.css({'display': 'block'});
							}
							iwFormHolder.find('#phoneNumber').focus();
						}, 50);
						return false;
					}
					
					var dialCode = countryCode.intlTelInput("getSelectedCountryData").dialCode
					var phoneNumber = iwFormHolder.find('#phoneNumber');				
					var input = dialCode.replace('+', '') + phoneNumber.val();
					
					console.log(formDetails.url + input);
					$.ajax({
						  url: formDetails.url + (formDetails.location ? formDetails.location + '/' : '') + input
					}).fail(function(jqXHR, textStatus) {
						iwFormHolder.find('.iw-form-greeting').text(formDetails.error);
					    console.log( "Request failed: " + jqXHR.statusText );
					})
	
					if (mobileCheck() === true) {
						component.find('.iw-cn-wrapper').removeClass('iw-opened-nav');
						iwFormHolder.css({'left': iwFormHolder.css('left').replace('px', '') - 20 + 'px'});
					}
					iwFormHolder.find('.iw-form-greeting').css({'display': 'block'});
					iwFormHolder.find('.iw-form-details').css({'display': 'none'});
					
					window.setTimeout(function () {
						iwFormHolder.find('.iw-form-greeting').css({'display': 'none'});
						iwFormHolder.find('.iw-form-details').css({'display': 'block'});
						component.find('.iw-cn-button').trigger('click');
						
					}, 3000);
					return true;
				});
			} else if (formType === 'contact') {
				iwFormHolder.find('.iw-form').css({'overflow': ''});
				iwFormHolder.find('.iw-form-input').css({'display': 'none'});
				iwFormHolder.find('.iw-form-contact').css({'display': 'block'});
				
				iwFormHolder.find('#contactLabel').text(formDetails.label);
				iwFormHolder.find('#contactNumber').text(formDetails.number ? formatPhone(formDetails.number) : '');
				iwFormHolder.find('#contactIcon').attr({'src': '../images/' + formDetails.image});
				iwFormHolder.find('#linkDescription').text(formDetails.linkDesc);
				
				if (mobileCheck() && isIPhone()) {
					var vCard = createVCard(); 
					vCard.init();
					vCard.name(formDetails.name, '');
					vCard.work(formDetails.number);
					
					var data = vCard.get();
					iwFormHolder.find('.iw-form-contact-link').attr({
						'href': 'data:text/vcard;charset=utf-8,' + encodeURIComponent(data), 
						'download': (formDetails.name.replace(/ /g, '_') + '.vcf')});										
				} else {
					iwFormHolder.find('.iw-form-contact-link').attr({'href': formDetails.number ? ('tel:+' + formDetails.number) : '#'});										
				}
			}
			
			var bottom, left;
			if (mobileCheck() === true) {
				var innerHeight = window.innerHeight;
				var innerWidth = window.innerWidth;
				if (innerHeight <= 380) {
					bottom = innerHeight / 1.25 + 'px';					
				} else {
					bottom = innerHeight / 1.75 + 'px';
				}
				left = (innerWidth / 2) - 72;	
				left = left < 0 ? 0 : (left  + 'px');
			} else {
				if (typeof index === 'string') {
					index = parseInt(index);
				}
				
				if (typeof size === 'string') {
					size = parseInt(size);
				}
				
				var baseDegrees = (0.65 * Math.PI / size) * index;				
				bottom = Math.cos(baseDegrees)*225.0778+ 56+'px';
				left = Math.sin(baseDegrees)*225.0778 + 56+'px';
			}
			
			iwFormHolder.css({
					'bottom': bottom,
					'left': left
				});
			iwFormHolder.attr({
				'data-index': index
			});
		};
		
		function isMatchPattern(evt, regex) {
			var theEvent = evt || window.event;
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode(key);
			if (!regex.test(key)) {
				theEvent.returnValue = false;
				if (theEvent.preventDefault) {
					theEvent.preventDefault();
				}
			}
		};
		
		function adjustComponentHeight(component, isIncrease) {
			var bottom = component.css('bottom');
			
			var increaseTo = 170;
			if (!isIncrease) {
				increaseTo = increaseTo * -1;
			}		
			
			component.css({
				bottom: parseFloat(bottom.replace('px', '')) + increaseTo + 'px' 
			});
		}
		
		function createItem(skew, aAngle, options, key, itemSize, index) {
			var iAngle = 0, calcSkew = 0, calcAAngle = 0;
			
			if (itemSize <= 2) {
				iAngle = index * 135;
				calcSkew = -45;
				calcAAngle = index * (90 - iAngle);
			} else {
				iAngle = (index === 0) ? skew - 22.5 : (index+1) * skew + (67.5 - skew);
				calcSkew = (index === 0 || index === (itemSize - 1)) ? 90 : skew;
				calcAAngle = (index === 0) ? aAngle + (90 - skew): aAngle;
			}
			
			var item = $(document.createElement('li'));
			item.css({
				'-webkit-transform': 'rotate(' + iAngle + 'deg) skew(' + (90 - calcSkew) + 'deg)',
				'-moz-transform': 'rotate(' + iAngle + 'deg) skew(' + (90 - calcSkew) + 'deg)',
				'-ms-transform': 'rotate(' + iAngle + 'deg) skew(' + (90 - calcSkew) + 'deg)',
				'-o-transform': 'rotate(' + iAngle + 'deg) skew(' + (90 - calcSkew) + 'deg)',
				'transform': 'rotate(' + iAngle + 'deg) skew(' + (90 - calcSkew) + 'deg)'
			});
			
			var link = null;
			if (options.items[key].needInputForm === true) {
				link = $(document.createElement('div'));
				link.attr({
					'data-index': index,
					'data-form': 'input'
				});
			} else if (options.items[key].needContactForm === true) {
				link = $(document.createElement('div'));
				link.attr({
					'data-index': index,
					'data-form': 'contact'
				});
			} else if (options.items[key].needNewWindow === true) {
				link = $(document.createElement('a'));
				link.attr({
					href: options.items[key].url ? 'javascript:window.open("'+options.items[key].url+'", "_blank", "' + options.items[key].windowSize + '");' : '#',
					'data-index': index
				});

			} else {
				link = $(document.createElement('a'));
				link.attr({
					href: options.items[key].url ? options.items[key].url : '#',
					target: '_blank',
					'data-index': index
				});
			}
			
			link.css({
				'-webkit-transform': 'skew(' + (90 - calcSkew) * -1 + 'deg) rotate(' + calcAAngle + 'deg) scale(1)',
				'-moz-transform': 'skew(' + (90 - calcSkew) * -1 + 'deg) rotate(' + calcAAngle + 'deg) scale(1)',
				'-ms-transform': 'skew(' + (90 - calcSkew) * -1 + 'deg) rotate(' + calcAAngle + 'deg) scale(1)',
				'-o-transform': 'skew(' + (90 - calcSkew) * -1 + 'deg) rotate(' + calcAAngle + 'deg) scale(1)',
				'transform': 'skew(' + (90 - calcSkew) * -1 + 'deg) rotate(' + calcAAngle + 'deg) scale(1)'
			});
			link.on('click', function() {
				$(this).blur();
				
				var iwFormHolder = iwComponent.find('.iw-form-holder');
				var formDataIdx = iwFormHolder.attr('data-index');
				var dataIdx = $(this).attr('data-index');
				
				if (dataIdx === formDataIdx) {
					hideInputForm(iwComponent);
				} else {
					var dataform = $(this).attr('data-form');
					if (dataform) {
						showInputForm(iwComponent, dataIdx, itemSize, dataform, options.items[key].formDetails);
					} else {
						hideInputForm(iwComponent);
					}				
				}
			});
			
			if (options.items[key].description) {
				var span = $('<span>' + options.items[key].description + '</span>');
				link.append(span);
			}
			
			if (options.items[key].image) {
				var img = $('<img>', {'src' : '../images/' + options.items[key].image});
				link.append(img);
			}
			
			return item.append(link);
		}		
		
		var iwComponent = this.$element;
		iwComponent.addClass('iw-component');
		
		if (this.options.theme) {
			iwComponent.addClass(this.options.theme);
		}
		
		if (this.options.position) {
			iwComponent.css(this.options.position);
		}
		
		var iwCnOverlay = $(document.createElement('div')).addClass('iw-cn-overlay');
		
		var iwCnButton = $(document.createElement('button')).addClass('iw-cn-button');
		if (this.options.helpOnGo.image) {
			iwCnButton.append($('<img src="../images/' + this.options.helpOnGo.image + '"></img>'));
		} else {
			iwCnButton.append($('<span>' + this.options.helpOnGo.label + '</span>'));
		}
		
		var iwCnWrapper = $(document.createElement('div')).addClass('iw-cn-wrapper');
		iwCnWrapper.append($(document.createElement('div')).addClass('iw-cn-sm-cover'));
		iwCnWrapper.append($(document.createElement('div')).addClass('iw-cn-bg-cover'));

		var itemSize = this.options.required.indexOf('ALL') !== -1 ? Object.keys(this.options.items).length : this.options.required.length;

		var skew = 135 / itemSize;
		var aAngle = 135/(2 * itemSize) - 90;
		var iwCnUl = $(document.createElement('ul'));

		for (var j = 0; j < this.options.required.length; j ++) {
			if (this.options.required[j] === 'ALL') {
				var i = 0;
				for (var key in this.options.items) {
					iwCnUl.append(createItem(skew, aAngle, this.options, key, itemSize, i));
					i ++;
				}
				break;

			} else {
				iwCnUl.append(createItem(skew, aAngle, this.options, this.options.required[j], itemSize, j));
				
			}
		}
		iwCnWrapper.append(iwCnUl);	
		
		var countryCode = $(document.createElement('input')).addClass('iw-form-control')
			.attr({
				'type': 'tel',
				'id': 'countryCode',
				'name': 'countryCode',
				'tabindex' : '1'
			}).keypress(function(evt) {
				isMatchPattern(evt, /[\+0-9]/);
			}).focus(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, false);
				}
			}).blur(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, true);
				}
			});
		var phoneNumber = $(document.createElement('input')).addClass('iw-form-control')
			.prop('required',true).attr({
				'type': 'tel',
				'id': 'phoneNumber',
				'name': 'phoneNumber',
				'tabindex' : '2',
				'autocomplete': 'off'
			}).keypress(function(evt) {
				isMatchPattern(evt, /[0-9\r\t]/);				
			}).keydown(function(evt) {
				if (evt.which === 9) {
					iwComponent.find('.iw-form').submit();
				}
			}).focus(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, false);
				}
			}).blur(function(evt) {
				if (mobileCheck() === true) {
					adjustComponentHeight(iwComponent, true);
				}
			});
		var submitBtn = $(document.createElement('button')).addClass('iw-btn')
			.attr({
				'id': 'submitButton',
				'type': 'submit',
				'tabindex' : '3'
			})
			.append($('<img src="../images/Aicon-send.png"></img>'));
		var iwFormInline = $(document.createElement('div')).addClass('iw-form-inline')
			.append(countryCode).append(phoneNumber).append(submitBtn);
		var iwFormGreeting = $(document.createElement('div')).addClass('iw-form-greeting');
		var iwFormInput = $(document.createElement('div')).addClass('iw-form-input')
			.append($('<label>', {'id': 'inputLabel', 'for' : 'phoneNumber'}))
			.append(iwFormInline)
			.append($('<a>', {
				text: 'www.servicefriendz.com', 
				'class': 'iw-form-link', 
				'href': 'http://www.servicefriendz.com'
			}));
		
		var iwFormContactInline = $(document.createElement('div')).addClass('iw-list-inline-holder')
			.append($('<ul>', {'class': 'iw-list-inline'})
					.append($('<li>')
						.append($('<img>', {'id': 'contactIcon'})))
					.append($('<li>')
						.append($('<h5>', {'id': 'contactLabel'}))
						.append($('<h3>', {'id': 'contactNumber'}))));
		var iwFormContactLink = $(document.createElement('div')).addClass('iw-form-contact-link-holder')
			.append($('<a>', {'class': 'iw-form-contact-link', 'href': '#'})
					.append($('<img>', {'src': '../images/addCont-icon.png'}))
					.append($('<span>', {'id': 'linkDescription'})));
		var iwFormContact = $(document.createElement('div')).addClass('iw-form-contact')
			.append(iwFormContactInline)
			.append(iwFormContactLink)
			.append($('<a>', {
				text: 'www.servicefriendz.com', 
				'class': 'iw-form-link', 
				'href': 'http://www.servicefriendz.com'
			}));
		var iwFormDetails = $(document.createElement('div')).addClass('iw-form-details')
			.append(iwFormInput)
			.append(iwFormContact);
		var iwFormGroup = $(document.createElement('div')).addClass('iw-form-group')
			.append($('<div>', {html: '\&times;', 'class': 'iw-form-close'})
					.click(function(evt) {
						hideInputForm(iwComponent);
					}))
			.append(iwFormGreeting).append(iwFormDetails);
		var iwForm = $(document.createElement('form')).addClass('iw-form')
			.attr({
				'action': 'javascript:void(0);'
			})
			.append(iwFormGroup);
		var iwFormHolder = $(document.createElement('div')).addClass('iw-form-holder')
			.append(iwForm);

		this.$body.append(iwCnOverlay);
		iwComponent.append(iwCnButton).append(iwCnWrapper).append(iwFormHolder);
		this.$intlTelInput = countryCode.intlTelInput({
			autoHideDialCode: false,
			nationalMode: false,
			defaultCountry: 'auto'
		});
	}
	
	/**
	 * The jQuery Plugin for the IFF Widget
	 * @public
	 */
	$.fn.iffWidget = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			var $this = $(this),
				data = $this.data('iff.widget');

			if (!data) {
				data = new Iff(this, typeof options == 'object' && options);
				$this.data('iff.widget', data);

				var open = false;
				
				var overlay = data.$body.find('.iw-cn-overlay');
				var button = data.$body.find('.iw-cn-button');
				var wrapper = data.$element.find('.iw-cn-wrapper');
				var iwFormHolder = data.$element.find('.iw-form-holder');
				data.$element.find('.iw-cn-button').on('click', function(event) {
					event.preventDefault();
					if (!open) {
						overlay.addClass('iw-opened-nav');
						button.addClass('iw-opened-nav');
						wrapper.addClass('iw-opened-nav');
					}
					else {
						button.removeClass('iw-opened-nav');
						wrapper.removeClass('iw-opened-nav');
						iwFormHolder.removeClass('iw-opened-nav');
						iwFormHolder.css({
							'bottom': '0',
							'left': '0'
						});
						iwFormHolder.attr({
							'data-index': '-1'
						});
						
						window.setTimeout(function () {
							overlay.removeClass('iw-opened-nav');
						}, 750);
					}
					open = !open;
				});
			}
		});
	};
	
	/**
	 * The constructor for the jQuery Plugin
	 * @public
	 */
	$.fn.iffWidget.Constructor = Iff;

})(window.jQuery, window, document);

function getHostIp(callback) {
	var url = "http://ipinfo.io/json";
	
	$.ajax({
		url: url
	}).done(function(data) {
		if (callback) {
		    callback(data);
		}
	}).fail(function(jqXHR, textStatus) {
		if (callback) {
			callback();
		}
	});
};
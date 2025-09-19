/*
 * HMI Technologies Mumbai
 ** Javascript **
 *
 * This is the default js file.
 *
*/


var zarazjs = {
	
	init: function() {
		// Array to store consented preferences
		zarazjs.purposeIds = [];
		if (zaraz.consent?.APIReady) {
			zarazjs.handleZarazConsentAPIReady();
		} else {
			document.addEventListener("zarazConsentAPIReady", zarazjs.handleZarazConsentAPIReady);
		}	
	},
					
	// Get cookies from zaraz
	getZarazCookie: function(name) {
		const value = '; ' + document.cookie;
		return value?.split('; '+name+'=')[1]?.split(";")[0];
	},
	
	handleZarazConsentAPIReady: function() {
		const consent_cookie = zarazjs.getZarazCookie("zaraz-consent");
		if (!consent_cookie) {
			$('.cf_modal_container').show();
			$('#cf_consent-buttons__manage-all').click(function() {
				$('#cf_modal_vendors,#cf_container, #cf_consent-buttons__save').toggle();
				$('#cf_consent-buttons__manage-all').hide();
			});
			
			
			$('#cf_consent-buttons__view-partners').click(function () {
				$('#cf_container, #cf_consent-buttons__view-partners').hide();
				$('#cf_consent-buttons__hide-partners, #cf_vendorlist').show();
			});

			$('#cf_consent-buttons__hide-partners').click(function () {
				$('#cf_container, #cf_consent-buttons__view-partners').show();
				$('#cf_consent-buttons__hide-partners, #cf_vendorlist').hide();
			});
			
			// Set all consent for when clicking on accept all button
			$('#cf_consent-buttons__accept-all').click(function () {
				zaraz.consent.setAll(true);
				zaraz.consent.sendQueuedEvents();
				$('.cf_modal').attr('open', false);
				$('.cf_modal_container').hide();
			});
			
			// Add purposeIds to array
			$('input[type="checkbox"]').on('change', function() {
				const purposeId = $(this).attr('data-purpose-id');
				if ($(this).is(':checked')) zarazjs.purposeIds.push(purposeId);
				else {
					const index = zarazjs.purposeIds.indexOf(purposeId);
					if (index > -1) zarazjs.purposeIds.splice(index, 1);
				}
			});

			$('#cf_consent-buttons__save').click(function() {
				/*
				if (zarazjs.purposeIds.length) {
					for (let i in zarazjs.purposeIds ) {
						zaraz.consent.set({ [zarazjs.purposeIds[i]] : true });
						$('.cf_modal').attr('open', false);
					}
				} else {*/
					zaraz.consent.setAll(true);
					zaraz.consent.sendQueuedEvents();
					$('.cf_modal').attr('open', false);
					$('.cf_modal_container').hide();
				//}
			});
		} else {
			$('.cf_modal').attr('open', false);
			$('.cf_modal_container').hide();
		}
	},
	
};
zarazjs.init();
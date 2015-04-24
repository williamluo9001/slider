;(function ( $, window, document, undefined ) {
    $(document).ready(function() {

        set_iframe_class();
        ui_init();
        form_events();
        referral_links();
    });


    function validate_email(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function set_iframe_class() {
        var isInIFrame = (window.location != window.parent.location);
        if(isInIFrame == true){
            $('body').addClass('iframe');
        }
        else {
            $('body').removeClass('iframe');
        }
    }

    function ui_init() {
        $('.navigation-animated-buttons').scrollSlacker({ elasticity : 3 });
        $('#section-search-inner').scrollSlacker({ elasticity : 5, ignored : [$('#search-icon')] });
        $('#demo-header-section-inner').scrollSlacker({ elasticity : 5 });
        $('#about-header-section-inner').scrollSlacker({ elasticity : 5 });
        $('#support-header-section-inner').scrollSlacker({ elasticity : 5 });
        $('#codecanyon-button-wrap').scrollSlacker({ elasticity : 3 });
        $('#logo-footer').scrollSlacker({ elasticity : 1 });

        // main content box
        $('#section-grid').css({ height : $('#section-grid').height() });
    }

    function form_events() {
        // contact form
        $('#button-send-email').on('click', function() {
            var valid = true;

            if (!validate_email($('#input-email').val())) {
                valid = false;
                $('#input-email').closest('.form-group').addClass('has-error');
            } else {
                $('#input-email').closest('.form-group').removeClass('has-error');
            }

            if ($('#textarea-message').val().length == 0) {
                valid = false;
                $('#textarea-message').closest('.form-group').addClass('has-error');
            } else {
                $('#textarea-message').closest('.form-group').removeClass('has-error');
            }

            // Validate
            if (valid) {
                // Send
                $(this).prop('disabled', 'disabled');
                $(this).html('Sending...');

                var button = $(this);

                $.post('contact_form.php', {
                    email : $('#input-email').val(),
                    message : $('#textarea-message').val()
                }).done(function() {
                    button.addClass('btn-success').removeClass('btn-primary');
                    button.html('Done');
                });

            }

            return false;
        });
    }

    function referral_links() {
        // referral links
        $('a').each(function() {
            var href = $(this).prop('href');

            if (href.search("codecanyon") > 0) {
                href += '?ref=nickys';
                $(this).prop('href', href);
            }
        });
    }

})( jQuery, window, document );

// RESIZABLE DEMO BOX

;(function ( $, window, document, undefined ) {
    $(document).ready(function() {
    	var dragging = false;
    	var initial_event_x = 0;

    	var resizable_container = $('.demo-resizable-container');
    	var original_width = resizable_container.width();
    	var current_width = original_width;
    	var event_start_width = original_width;

        $(document).on('mousedown', function(e) {
        	if (!dragging && ($(e.target).hasClass('demo-resizable-container-button') || $(e.target).closest('demo-resizable-container-button').length > 0)) {
        		dragging = true;
        		initial_event_x = e.pageX;
        		event_start_width = resizable_container.width();
        	}
        });

        $(document).on('mousemove', function(e) {
        	if (dragging) {
        		var offsex_x = initial_event_x - e.pageX;
        		var current_width = (event_start_width - offsex_x > original_width) ? original_width : event_start_width - offsex_x;

        		resizable_container.css({
        			width : current_width
        		});

                $.resizeCallback(e);
        	}
        });

        $(document).on('mouseup', function(e) {
        	if (dragging) {
        		dragging = false;
        	}
        });
    });
})( jQuery, window, document );

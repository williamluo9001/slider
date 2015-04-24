;(function ( $, window, document, undefined ) {
    var selected_ticket_id = 0;

    $(document).ready(function() {
        var current_step = 1;

        $('#button-new-ticket').on('click', function() {
            $('#submit-ticket-wrapper').show();
        });

        $('#submit-ticket-back').on('click', function() {
            current_step = (current_step > 1) ? current_step - 1 : current_step;
            show_step(current_step);
        });

        $('#submit-ticket-next').on('click', function() {
            if (current_step == 3) {
                submit_ticket();
            } else if (validate_form(current_step)) {
                current_step = (current_step < 3) ? current_step + 1 : current_step;
                show_step(current_step);
            }
        });

        $("#tickets-table").on('click', function(e) {
            selected_ticket_id = $(e.target).closest('tr').data('id');
            fetch_ticket();
        });

        $('#reply-button').on('click', function() {
            if ($('#textarea-reply').val().length == 0) {
                $('#textarea-reply').closest('.form-group').addClass('has-error');
            } else {
                $('#textarea-reply').closest('.form-group').removeClass('has-error');

                submit_reply();
            }
        });

        fetch_tickets();
    });

    function submit_reply() {
        var user_id = $('#logged-in').attr('data-userid');
        var text = $('#textarea-reply').val();
        var for_ticket = selected_ticket_id;

        $('#reply-button').attr('disabled', 'disabled');
        $('#reply-button').html('Sending...');

        $.post('support/submit_reply.php', { user_id : user_id, text : text, for_ticket : for_ticket }).done(function() {
            fetch_ticket();
            $('#textarea-reply').val('');
            $('#reply-button').removeAttr('disabled');
            $('#reply-button').html('Send');
        });
    }

    function fetch_ticket() {
        // display loading

        $.post('support/fetch_ticket.php', { ticket_id : selected_ticket_id }).done(function(response) {
            var result = $.parseJSON(response);

            // hide loading

            var date = Date.parse(result.ticket.date);
            var d2 = date;
            d2.setHours(date.getHours() + 5 - date.getTimezoneOffset()/60);
            var dateString = d2.toISOString();

            $('#original-ticket h2').html(result.ticket.title);
            $('#original-ticket .ticket-date').html('<abbr class="timeago" title="'+dateString+'">' + result.ticket.date + '</abbr>');
            $('#original-ticket p').html(safe_tags_replace(result.ticket.text).replace(/(?:\r\n|\r|\n)/g, '<br />'));

            $('#replies').html('');

            if (result.replies.length > 0) {
                for (var i=0; i<result.replies.length; i++) {
                    var from_webcraft = "";

                    if (result.replies[i].is_admin == 1) {
                        from_webcraft = " from-webcraft";
                    }

                    var html = '<div class="conversation-bubble'+ from_webcraft +'">';
                        html += '<img src="' + result.replies[i].avatar + '">';

                    if (result.replies[i].is_admin == 1) {
                        html += '<h2><span>Webcraft</span> said:</h2>';
                    } else {
                        html += '<h2><span>' + result.replies[i].display_name + '</span> said:</h2>';
                    }

                    var date = Date.parse(result.replies[i].date);
                    var d2 = date;
                    d2.setHours(date.getHours() + 5 - date.getTimezoneOffset()/60);
                    var dateString = d2.toISOString();

                    html += '<div class="bubble-date"><abbr class="timeago" title="'+dateString+'">' + result.replies[i].date + '</abbr></div>';
                    html += '<p>' + safe_tags_replace(result.replies[i].text).replace(/(?:\r\n|\r|\n)/g, '<br />') + '</p>';
                    html += '</div>';

                    $('#replies').append(html);
                }
            }

            $('#conversation').show();
            jQuery("abbr.timeago").timeago();
        });
    }

    function fetch_tickets() {
        var user_id = $('#logged-in').attr('data-userid');

        if (user_id == undefined) {
            return;
        }

        $.post('support/fetch_tickets.php', { user_id : user_id }).done(function(response) {
            var result = $.parseJSON(response);

            var container = $('#tickets-container table tbody');
            container.html('');

            if (result.length > 0) {
                for (var i=0; i<result.length; i++) {
                    var date = Date.parse(result[i].date);
                    var d2 = date;
                    d2.setHours(date.getHours() + 5 - date.getTimezoneOffset()/60);
                    var dateString = d2.toISOString();

                    var html = '<tr data-id="' +result[i].id+ '">';
                        html += '<td><abbr class="timeago" title="'+dateString+'">' +result[i].date+ '</abbr></td>';
                        html += '<td>' +result[i].title+ '</td>';
                        html += '</tr>';

                    container.append(html);
                }

                $('#no-tickets').hide();
                $('#tickets-table').show();
            } else {
                $('#no-tickets').show();
                $('#tickets-table').hide();
            }

            jQuery("abbr.timeago").timeago();
        });
    }

    function submit_ticket() {
        $('#submit-ticket-back').attr('disabled', 'disabled');
        $('#submit-ticket-next').attr('disabled', 'disabled');
        $('#submit-ticket-next').html('Sending...');

        var user_id = $('#logged-in').attr('data-userid');
        var product = $('#select-product').val();
        var email = $('#input-email').val();
        var title = $('#input-title').val();
        var message = $('#textarea-message').val();

        $.post('support/submit_ticket.php', { user_id : user_id, product : product, email : email, title : title, message : message }).done(function(response) {
            $('#ticket-summary-wrap').css({ height : $('#ticket-summary-wrap').height() });
            $('#ticket-summary-wrap').addClass('ticket-sent');
            $('#submit-ticket-next').html('Done');

            fetch_tickets();
            console.log(response);
        });
    }

    function show_step(index) {
        if (index == 1) {
            $('#submit-ticket-form-step-1').show();
            $('#submit-ticket-form-step-2').hide();
            $('#submit-ticket-form-step-3').hide();

            $('#submit-ticket-steps').removeAttr('class').addClass('submit-ticket-progress-1');

            $('#submit-ticket-back').hide();
            $('#submit-ticket-next').show();
        }
        if (index == 2) {
            $('#submit-ticket-form-step-1').hide();
            $('#submit-ticket-form-step-2').show();
            $('#submit-ticket-form-step-3').hide();

            $('#submit-ticket-steps').removeAttr('class').addClass('submit-ticket-progress-2');

            $('#submit-ticket-back').show();
            $('#submit-ticket-next').show();
        }
        if (index == 3) {
            $('#submit-ticket-form-step-1').hide();
            $('#submit-ticket-form-step-2').hide();
            $('#submit-ticket-form-step-3').show();

            $('#submit-ticket-steps').removeAttr('class').addClass('submit-ticket-progress-3');

            $('#submit-ticket-back').show();
            $('#submit-ticket-next').show().html('Submit');

            $('#summary-product').html($('#select-product').val());
            $('#summary-email').html($('#input-email').val());
            $('#summary-title').html($('#input-title').val());
            $('#summary-message').html(safe_tags_replace($('#textarea-message').val()));
        }
    }

    function validate_form(step) {
        // return true;

        var valid = true;
        var email_regex = "\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b";

        // Product
        if ($('#select-product').val() === 'default') {
            $('#select-product').closest('.form-group').addClass('has-error');
            valid = false;
        } else {
            $('#select-product').closest('.form-group').removeClass('has-error');
        }

        // Email
        if ($('#input-email').val().length == 0 || !validate_email($('#input-email').val())) {
            $('#input-email').closest('.form-group').addClass('has-error');
            valid = false;
        } else {
            $('#input-email').closest('.form-group').removeClass('has-error');
        }

        if (step == 2) {
            // Title
            if ($('#input-title').val().length == 0) {
                $('#input-title').closest('.form-group').addClass('has-error');
                valid = false;
            } else {
                $('#input-title').closest('.form-group').removeClass('has-error');
            }

            // Message
            if ($('#textarea-message').val().length == 0) {
                $('#textarea-message').closest('.form-group').addClass('has-error');
                valid = false;
            } else {
                $('#textarea-message').closest('.form-group').removeClass('has-error');
            }
        }

        return valid;
    }

    function validate_email(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };

    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    function safe_tags_replace(str) {
        return str.replace(/[&<>]/g, replaceTag);
    }

})( jQuery, window, document );
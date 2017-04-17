/**
 * Created by Lena on 20.03.2017.
 */

window.onload =(function() {
    $.get('/friendslist', function (data) {
        /* ++++++++ */
        /* Globals */
        /* ++++++ */
        var friendslist = JSON.parse(data);
        var js_activeUser = friendslist[0];
        var js_selectedUser = friendslist[1];
        var profileInfo; //set in script;

        /*****
         * json-data structure:
         * [ {logged-in User}, {friend 1}, {friend 2}, ... ]
         */

        /* ++++++++ */
        /* Methods */
        /* ++++++ */
        /* ----------------------------------------- */
        /* update active receiver based on selection */
        /* ----------------------------------------- */
        var setReceiverToSelection = function () {
            let selection = $("#friendslist").prop('selectedIndex');
            js_selectedUser = friendslist[selection+1];
        };

        /* -------------------------------------- */
        /* Update page based on selected receiver */
        /* -------------------------------------- */
        var updateOnReceiverSelection = function () {
            $.ajax({
                contentType: "application/json; charset=utf-8",
                url: '/getReceiverId',
                method: 'POST',
                data: JSON.stringify({

                    idUser: js_selectedUser.iduser.toString()

                }),
                datatype: 'json',
                success: ( function () {
                    updateConversation();
                })
            })
        };

        /* -------------- */
        /* Submit Message */
        /* -------------- */
        function sendMessage() {
            $.ajax({
                contentType: "application/json; charset=utf-8",
                url: '/saveMessageToDatabase',
                method: 'POST',
                data:JSON.stringify({

                    message: $('.message_input_field').serialize().toString()

                }),
                dataType: 'json',
                complete: ( function () {
                    updateConversation();
                })
            });
        }

        /* ------------------------------ */
        /* Scroll down to newest Message */
        /* ---------------------------- */
        function updateScroll() {

            var element = document.getElementById("history");
            element.scrollTop = element.scrollHeight;

        }
        /* ---------------------------- */
        /* Display conversation history */
        /* ---------------------------- */
        // -- called on update Receiver success & sendMessage() completion.
        var updateConversation = function () {

            $('#history').empty();
            $('.message_input_field').val('');

            $.get('/messageHistory', function (data) {
                let msg = JSON.parse(data);
                let conversationPartner = friendslist[$("#friendslist").prop('selectedIndex')+1];

                // clear conversation
                $('.title').empty();
                $('.title').append("Conversation with "+conversationPartner.name);

                // append sender's name before each msg
                $.each(msg, function (i, option) {
                    let text = $('<div class="test">').attr("value", option).text(option.text);
                    let senderName = (js_activeUser.iduser === option.receiver ? js_activeUser.name : conversationPartner.name);
                    if (senderName == js_activeUser.name) {
                        $('#history').append($('<li class="sender">').text(senderName + ":").append(text));
                    }else{
                        $('#history').append($('<li class="receiver">').text(senderName + ":").append(text));
                    }
                });
                updateScroll();
            });
        };

        /* ---------------------------------- */
        /* Update stats to the selected user */
        /* -------------------------------- */
        var updateUserStats = function () {
            let selectedIndex = $("#friendslist").prop('selectedIndex')+1;
            $('.friendStats').empty();
            let name = profileInfo[selectedIndex].name
            let amtPlayedGames = profileInfo[selectedIndex].amtPlayedGames;
            let avgScore = profileInfo[selectedIndex].avgScore;
            let highScore = profileInfo[selectedIndex].highScore;

            $('.friendStats').append(name);
            $('.friendStats').append('<br>Games played:&nbsp;&nbsp;&nbsp;'+amtPlayedGames);
            $('.friendStats').append('<br>Highscore:&nbsp;&nbsp;&nbsp;'+highScore);
            $('.friendStats').append('<br>Average score:&nbsp;&nbsp;&nbsp;'+avgScore);

        };

        /* +++++++ */
        /* Script */
        /* +++++ */

        /*receive Info for stats*/
        $.get('/profileInfo', function(data) {
            profileInfo = JSON.parse(data);

            // Reset conversation & Friendslist
            $('#history').empty();
            if (js_selectedUser !== undefined) {
                $.each(friendslist, function (i, option) {
                    if (i == 1) {
                        $('#friendslist').append($('#def').attr("a", option).text(option.name));
                    } else if (i > 0) {
                        $('#friendslist').append($('<option/>').attr("value", option).text(option.name));
                    }
                });
                // Add stats of default selection
                $('.myStats').append(name+" (You)");
                $('.myStats').append('<br>Games played:&nbsp;&nbsp;&nbsp;'+profileInfo[0].amtPlayedGames);
                $('.myStats').append('<br>Highscore:&nbsp;&nbsp;&nbsp;'+profileInfo[0].avgScore);
                $('.myStats').append('<br>Average score:&nbsp;&nbsp;&nbsp;'+profileInfo[0].highScore);

                updateOnReceiverSelection();
                updateUserStats();

                // Subscribe to relevant input
                $('#friendslist').on('change', function () {
                    setReceiverToSelection();
                    updateOnReceiverSelection();
                    updateUserStats();
                });

                $('#messageSubmit').on('click', function () {
                    sendMessage();
                })

            } else {
                alert('Looks like your Friendslist is empty.\n\nPlease look to the TOP LEFT to add a friend.');
            }
        })
    })
});

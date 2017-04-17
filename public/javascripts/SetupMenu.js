/**
 * Created by Benedict on 08.03.2017.
 */

$( document ).ready(function() {

    /* --------------------------------------------------------------- */
    /* retrieve all levels from DB and display them in selectable list */
    /* --------------------------------------------------------------- */
    $.get('/levelList', function (data) {
        /* ++++++++ */
        /* Globals */
        var lvlList = JSON.parse(data);
        var selectedLevel = lvlList[0];
        var idLevel = selectedLevel.idLevel;
        var gametext = selectedLevel.levelText;
        var top3Games; //set in script


        /* ++++++++ */
        /* Methods */
        /* -------------------------------- */
        /* Send current selection to server */
        /* -------------------------------- */
        var sendTextAndIdToGame = function() {
            $.ajax({
                contentType: "application/json; charset=utf-8",
                url: '/gametext',
                method: 'POST',
                data: JSON.stringify({

                    idLevel: selectedLevel.idLevel.toString(),
                    levelText: selectedLevel.levelText.toString()

                })
            })
        };

        /* ------------- */
        /* populate top3 */
        /* ------------- */
        var top3 = function() {
            $.each(top3Games, function (i, option) {
                if (option.idLevel == idLevel) {
                    let nameAndScore = option.username + ":  " + option.score;
                    $('#highscoreList').append($('<li>').attr(option).text(nameAndScore));
                }
            });
        };

        /* --------------------- */
        /* Render selection text */
        /* --------------------- */
        var lvlText = function() {
            // Clear current text
            $('#selectedLevelText').empty();
            $('#highscoreList').empty();

            // Set new selection data
            let selection = $("#lvlList").prop('selectedIndex');
            selectedLevel = lvlList[selection];
            idLevel = lvlList[selection].idLevel;
            gametext = selectedLevel.levelText;

            // render new selection text
            $('#selectedLevelText').append($('<p>').attr("value", selectedLevel).text(selectedLevel.levelText));
        };

        /* +++++++ */
        /* Script */
        /*++++++ */

        //render default 1st item
        $('#selectedLevelText').append($('<p>').attr("value", selectedLevel).text(selectedLevel.levelText));

        //populate level-name list
        $.each(lvlList, function (i, option) {
            if (i== 0){
                $('#lvlList').append($('#def').attr("a", option).text(option.levelName));//for default selection on first page load
            }else {
                $('#lvlList').append($('<option/>').attr("value", option).text(option.levelName));
            }
        });

        //determine top3
        $.get('/top3Scores', function (data) {
            top3Games = JSON.parse(data);

            //call necessary functions on page load
            sendTextAndIdToGame();
            top3();

            //call necessary functions on new level selection
            $('#lvlList').on('change', function () {
                lvlText();
                sendTextAndIdToGame();
                top3();
            });
        });
    });
});

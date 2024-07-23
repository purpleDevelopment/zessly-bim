$(document).ready(function() {
    $('#nav_open').on('click',showNav);
    $('#nav_close').on('click',hideNav);
    // popup event listeners
    $('.open-refs').on('click',openRefs);
    $('.close-refs').on('click',closeRefs);
    $('.open-prefs').on('click',openPrefs);
    $('.close-prefs').on('click',closePrefs);
    $('.open-popup').on('click',openPopup);
    $('.close-popup').on('click',closePopup);
    $('body').on('click',function() {
        if ($('#nav_overlay').hasClass('active')) {
            hideNav();
        }
    });
    $('#study_btn').on('click',function(){
        $('#study_popup, #study_back_btn').show();
        $('#first_popup, #study_btn').hide();
    });
    $('#study_back_btn').on('click',function(){
        $('#study_popup, #study_back_btn').hide();
        $('#first_popup, #study_btn').show();
    });
});

function openPopup(e) {
    e.stopPropagation();
    if ($('#nav_overlay').hasClass('active')) {
            hideNav();
        }
    // get the popup ID and assign as var
    popupId = $(this).attr('data-popuplink'),
    // show the close button and hide any links we want hidden
    $('.close-popup').show();
    $('.open-popup, #nav_open, .open-refs').hide();
    // fade the popup in and show it is active
    $(popupId).addClass('active').fadeIn(500);
}

function closePopup() {
    // hide the close button and display relevant links
    $('.close-popup').hide();
    $('.open-popup, #nav_open, .open-refs').show();
    // hide the active popup and show it is inactive
    $('.popup.active').fadeOut(150).removeClass('active');
}

function openRefs(e) {
    e.stopPropagation();
    if ($('#nav_overlay').hasClass('active')) {
            hideNav();
        }
    // get the popup ID and assign as var
    popupId = $(this).attr('data-popuplink');
    // show the close button and hide any links we want hidden
    $('.close-refs').show();
    $('.open-refs, .open-popup, #nav_open').hide();
    // fade the popup in and show it is active
    $(popupId).addClass('active').fadeIn(500);
}
function closeRefs() {
    // hide the close button and display relevant links
    $('.close-refs').hide();
    $('.open-refs, .open-popup, #nav_open').show();
    // hide the active popup and show it is inactive
    $('.refs.active').fadeOut(150).removeClass('active');
}

function openPrefs(e) {
    e.stopPropagation();
    // get the popup ID and assign as var
    popupId = $(this).attr('data-popuplink');
    // show the close button and hide any links we want hidden
    $('.close-prefs').show();
    $('.open-prefs, .close-popup').hide();

    // fade the popup in and show it is active
    $(popupId).addClass('active').fadeIn(500);
}
function closePrefs() {
    // hide the close button and display relevant links
    $('.close-prefs').hide();
    $('.open-prefs, .close-popup').show();
    // hide the active popup and show it is inactive
    $('.prefs.active').fadeOut(150).removeClass('active');
}

// Slide the navigation out to show it - or slide it back to hide it
function showNav(e) {
    e.stopPropagation();
    $('nav').animate({
        right: '0%'
    }, 350, function(){
        $('#nav_overlay').addClass('active');
    });
    $('#nav_close').show();
    $('#nav_open').hide();
}

function hideNav() {
    $('nav').animate({
        right: '-403px'
    }, 350, function(){
        $('#nav_overlay').removeClass('active');
    });
    $('#nav_close').hide();
    $('#nav_open').show();
}

$('#study_btn').click(function(){
    console.log('pop');
    $('#study_popup, #study_back_btn').show();
    $('#first_popup, #study_btn').hide();
});
$('#study_back_btn').click(function(){
        console.log('pop2');
    $('#study_popup, #study_back_btn').hide();
    $('#first_popup, #study_btn').show();
});
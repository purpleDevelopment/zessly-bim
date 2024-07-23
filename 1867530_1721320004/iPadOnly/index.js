var togCurrImg = 1;
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
    $(".toggle-btn").on("click", toggleScreen);
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

    $('#packButton').on('click',function(){
        calculateCompPacks()
        $("#screen1").hide().removeClass('active');
        $("#screen2").addClass('active');
    });

    $('#packResultsButton').on('click',function(){
        calculatePackResults()
        $("#screen2").hide().removeClass('active');
        $("#screen3").addClass('active');
    });
 
    $('#mgsButton').on('click',function(){
        calculateCompMG()
        $("#screen1").hide().removeClass('active');
        $("#screen4").addClass('active');
    });

    $('#mgsResultsButton').on('click',function(){
        calculateMGResults()
        $("#screen4").hide().removeClass('active');
        $("#screen5").addClass('active');
    });

    $("#zpkpr").on({
        keyup: function() {
            calculateZessPacks();
        },
        blur: function() { 
            calculateZessPacks();
        }
    });

    $("#mgzpkpr").on({
        keyup: function() {
            calculateZessMG();
        },
        blur: function() { 
            calculateZessMG();
        }
    });


    packChart = savingsChart('0', '0', '0' )    
    mgsChart = chartMGS('0', '0', '0' ) 

});


function calculateCompPacks(){

    var compPrice = parseFloat($('#tpkpr').val());
    var noPacks = parseFloat($('#tpknu').val());

    $('#cpkpr').html("&#163;"+(compPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}));
    $('#cpknb').html(noPacks);
    $('#ctotsku').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, { minimumFractionDigits:0, maximumFractionDigits: 0}));
    $('#ctotsp').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0}));

    $('#zpknb').html(noPacks);

}

function calculateZessPacks(){

    var noPacks = parseFloat($('#tpknu').val());
    var zessPrice = parseFloat($('#zpkpr').val());

    $('#zsku').html("&#163;"+(zessPrice* noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#ztot').html("&#163;"+(zessPrice* noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

}

function calculatePackResults(){

    var compPrice = parseFloat($('#tpkpr').val());
    var noPacks = parseFloat($('#tpknu').val());
    var zessPrice = parseFloat($('#zpkpr').val());

    var compMonth = (compPrice * noPacks)/12;
    var zessMonth = (zessPrice * noPacks)/12;

    $('#in3mth').html("&#163;"+((compMonth*3) - (zessMonth*3)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#in6mth').html("&#163;"+((compMonth*6) - (zessMonth*6)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#in9mth').html("&#163;"+((compMonth*9) - (zessMonth*9)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    $('#spcs3mth').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#spcs6mth').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#spcs9mth').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    $('#spts3mth').html("&#163;"+ ((compMonth*3) + (zessMonth*9) ).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})); 
    $('#spts6mth').html("&#163;"+ ((compMonth*6) + (zessMonth*6) ).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})); 
    $('#spts9mth').html("&#163;"+ ((compMonth*9) + (zessMonth*3) ).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})); 

    $('#zps3mth').html("&#163;"+ ((compPrice * noPacks) - ((compMonth*3) +(zessMonth*9) )).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#zps6mth').html("&#163;"+ ((compPrice * noPacks) - ((compMonth*6) +(zessMonth*6) )).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#zps9mth').html("&#163;"+ ((compPrice* noPacks) - ((compMonth*9) +(zessMonth*3) )).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    var savings = (compPrice * noPacks) - (zessPrice * noPacks);
    $('#tapsz').html("&#163;"+savings.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    updateSavingsChart(mChart, (compPrice * noPacks), (zessPrice * noPacks), savings)
}


function calculateCompMG(){

    var compPrice = parseFloat($('#tprmg').val());
    var noPacks = parseFloat($('#tpknumg').val());

    $('#mgcpkpr').html("&#163;"+(compPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2}));
    $('#mgcpknb').html(noPacks);
    $('#mgtotsku').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, { minimumFractionDigits:0, maximumFractionDigits: 0}));
    $('#mgtotsp').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0}));

    $('#mgzpknb').html(noPacks);

}

function calculateZessMG(){

    var noPacks = parseFloat($('#tpknumg').val());
    var zessPrice = parseFloat($('#mgzpkpr').val());

    $('#mgzsku').html("&#163;"+(zessPrice* noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgztot').html("&#163;"+(zessPrice* noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

}

function calculateMGResults(){

    var compPrice = parseFloat($('#tprmg').val());
    var noPacks = parseFloat($('#tpknumg').val());
    var zessPrice = parseFloat($('#mgzpkpr').val());

    var compMonth = (compPrice * noPacks)/12;
    var zessMonth = (zessPrice * noPacks)/12;

    $('#mgin3mth').html("&#163;"+((compMonth*3) - (zessMonth*3)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgin6mth').html("&#163;"+((compMonth*6) - (zessMonth*6)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgin9mth').html("&#163;"+((compMonth*9) - (zessMonth*9)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    $('#mgspcs3mth').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgspcs6mth').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgspcs9mth').html("&#163;"+(compPrice * noPacks).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    $('#mgspts3mth').html("&#163;"+ ((compMonth*3) + (zessMonth*9) ).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})); 
    $('#mgspts6mth').html("&#163;"+ ((compMonth*6) + (zessMonth*6) ).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})); 
    $('#mgspts9mth').html("&#163;"+ ((compMonth*9) + (zessMonth*3) ).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})); 

    $('#mgzps3mth').html("&#163;"+ ((compPrice * noPacks) - ((compMonth*3) +(zessMonth*9) )).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgzps6mth').html("&#163;"+ ((compPrice * noPacks) - ((compMonth*6) +(zessMonth*6) )).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));
    $('#mgzps9mth').html("&#163;"+ ((compPrice* noPacks) - ((compMonth*9) +(zessMonth*3) )).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    var savings = (compPrice * noPacks) - (zessPrice * noPacks);
    $('#mgtapsz').html("&#163;"+savings.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}));

    updateMGChart(mgsChart, (compPrice * noPacks), (zessPrice * noPacks), savings)
}


function updateSavingsChart(myChart,value1, value2, value3){
    myChart.destroy();  
    packChart = savingsChart(value1, value2, value3);
}

function updateMGChart(myChart,value1, value2, value3){
    myChart.destroy();  
    mgsChart = chartMGS(value1, value2, value3);
}

function savingsChart(data1, data2, data3 ){
  var incSavings = document.getElementById("zessSavings");
  var myChart = new Chart(incSavings, {
      type: 'bar',
      data: {
          // labels: ['Potential annual savings available by switching to Rixathon','Savings in year one if switched in 2 months','Savings in year one if switched in 3 months','Savings in year one if switched in 6 months'],
          labels: [['Total','Comparator','Infliximab','Spend'],['Total','Zessly','(Infliximab)','Spend'],['Total annual','Potential Savings','Changing', 'to Zessly']],
          datasets: [{
              label: '',
              data: [data1,data2,data3,],
              backgroundColor: [
                  'rgba(96, 36, 100, 1)',
                  'rgba(30, 146, 20, 1)',
                  'rgba(125, 203, 178, 1)',
              ]
          }]
      },
      options: {
        plugins: {
          legend: {
              display: false,
              position: 'top',
            },
          datalabels: {
            anchor: 'end', // remove this line to get label in middle of the bar
            align: 'end',
            clamp: 'true',


           labels: {
           title: {
            font: {
              weight: 'bold',
              size: '16px'
            }
          },
            value: {
              color: '#ffffff'
            }
          } 

          },    
          scales: {
              y: {
                display: false,
                gridLines: {}
                  //  beginAtZero: true,
                  //   ticks: {
                  //    callback: function(value, index, values) {
                  //var str = value.toString();
                  //                      return '£'+str.toLocaleString();
                  //                }
                  //},
                  }
              },
              x: {
                ticks: {
                  color: '#000000',
                  font: {
                        weight: 600,
                      size: 12,
                    } ,
               },
               stacked: true, 
              grid: { display: false },
              }
          }
      }
  });
  return myChart;

}
function chartMGS(data1, data2, data3 ){
  var incSavings = document.getElementById("zessMGSavings");
  var myChart = new Chart(incSavings, {
      type: 'bar',
      data: {
          // labels: ['Potential annual savings available by switching to Rixathon','Savings in year one if switched in 2 months','Savings in year one if switched in 3 months','Savings in year one if switched in 6 months'],
          labels: [['Total','Comparator','Infliximab','Spend'],['Total','Zessly','(Infliximab)','Spend'],['Total annual','Potential Savings','Changing', 'to Zessly']],
          datasets: [{
              label: '',
              data: [data1,data2,data3,],
              backgroundColor: [
                  'rgba(96, 36, 100, 1)',
                  'rgba(30, 146, 20, 1)',
                  'rgba(125, 203, 178, 1)',
              ]
          }]
      },
      options: {
        plugins: {
          legend: {
              display: false,
              position: 'top',
            },
          datalabels: {
            anchor: 'end', // remove this line to get label in middle of the bar
            align: 'end',
            clamp: 'true',


           labels: {
           title: {
            font: {
              weight: 'bold',
              size: '16px'
            }
          },
            value: {
              color: '#ffffff'
            }
          } 

          },    
          scales: {
              y: {
                display: false,
                gridLines: {}
                  //  beginAtZero: true,
                  //   ticks: {
                  //    callback: function(value, index, values) {
                  //var str = value.toString();
                  //                      return '£'+str.toLocaleString();
                  //                }
                  //},
                  }
              },
              x: {
                ticks: {
                  color: '#000000',
                  font: {
                        weight: 600,
                      size: 12,
                    } ,
               },
               stacked: true, 
              grid: { display: false },
              }
          }
      }
  });
  return myChart;

}



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
    $('#nav_overlay').css('z-index', '10');
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
        $('#nav_overlay').css('z-index', '1').removeClass('active');
    });
    $('#nav_close').hide();
    $('#nav_open').show();
}
function toggleScreen(e) {
// Hide the existing image  
  $("#screen" + togCurrImg).hide().removeClass('active');
// if the user selected the prev screen
  if($(this).hasClass("prev-btn")) {
    togCurrImg --;
  }
  else {
    togCurrImg ++;
  }
// show the new screen and decide whether to show/hide the prev and next buttons
  $("#screen" + togCurrImg).addClass('active');
}


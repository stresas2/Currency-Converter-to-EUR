var currents_list = [];
var currents_rates = [];

var endpoint = 'latest'
var access_key = 'e4e5b51741e81dc12b259331d7ab283d';
var url = 'http://data.fixer.io/api/' + endpoint + '?access_key=' + access_key;

function upload_json()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {

            var myObj = JSON.parse(this.responseText);

            currents_list = Object.keys(myObj.rates);

            currents_rates = myObj.rates;

            Insert_Curents_To_List(currents_list, currents_rates);

        }
    };


    xmlhttp.open("GET", url, true);
    xmlhttp.send();

};


function Insert_Curents_To_List()
{

  var full_list_index = '';

  for(i = 0; i < currents_list.length; i++)
  {

      full_list_index += '<a class="dropdown-item" onClick="set_current_index(this);" href="#"><div id="current_name" class="d-inline">' + currents_list[i] + '</div><div id="current_rate" class="d-inline float-right">' + currents_rates[currents_list[i]].toFixed(3) + '</div></a>';
  }

  document.getElementById('full_list').innerHTML = full_list_index;

};


var time_left = 120;
var t;

function timedCount()
{

    document.getElementById("timer").innerHTML = time_left;
    t = setTimeout(timedCount, 1000);
    time_left = time_left - 1;

    if(time_left < 0)
    {
    	time_left = 120;
        upload_json();
    }

};

function update_now()
{

    time_left = 120;
    upload_json();

};

function set_current_index(obj)
{

   var selected_current_title = $('#current_name', obj).html();
   var selected_current_rate = $('#current_rate', obj).html();
   document.getElementById("current").innerHTML = selected_current_title;
   document.getElementById("rate").innerHTML = selected_current_rate;

};

function addZero(i)
{
    if (i < 10)
    {
        i = "0" + i;
    }
    return i;
}

function getActualFullDate() {
    var d = new Date();
    var day = addZero(d.getDate());
    var month = addZero(d.getMonth()+1);
    var year = addZero(d.getFullYear());
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return year + ". " + month + ". " + day + " (" + h + ":" + m + ":" + s + ")";
};



function createCookie(date, amount, current, amount_in_eur) {

    var search_index = document.cookie.replace(/(?:(?:^|.*;\s*)search_index\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    if(search_index == '')
    {
        search_index = 0;
        document.cookie = "search_index="+ search_index + "; path=/";
    }
    else
    {
        search_index++;
        document.cookie = "search_index="+ search_index + "; path=/";
    }

    document.cookie = "Search" + search_index + "="+ date + ";" + amount + ";" + current + ";" + amount_in_eur + ";" + "; path=/";


};

$(document).ready(function() {

    var amount = '';
    var amount_in_eur = '';
    var rate = '';

    upload_json();

    timedCount();

    $("#convert").click(function(){

       amount = $('#amount').val();
       rate = $('#rate').html();
       current = $('#current').html();

       if(!isNaN(amount) && current != 'Select Currency' && amount != '')
       {

        amount_in_eur = amount / rate;

        amount_in_eur = amount_in_eur.toFixed(3)

        $('#eur').text(amount_in_eur);

        var date = getActualFullDate();

        $('#history').append('<tr><td>' + date +'</td><td>'+ amount + '&nbsp;' + current +'</td><td><div> <div style="display: inline-block">'+ amount_in_eur + '</div>&nbsp; <div style="display: inline-block">EUR</div> </div></td></tr>');

        createCookie(date, amount, current, amount_in_eur);

    }

});

});

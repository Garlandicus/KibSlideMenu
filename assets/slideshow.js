//Global Variables
var loading                 = true;
var menuDisplay             = false;
var menuSlidesActive        = false;
var selectedItem            = -1;
var menuSwitchTime          = 1000;
var menuIdleTime            = 10000;
var menuLastSwitched        = 0;
var fadeTransitions         = true;

var list_of_menus           = "";
var list_of_items           = "";
var list_of_questions       = "";


// XML Menu location and Vars
var $xmlFileLocation = "menu.xml",
    xmlDoc  = 0,
    xmlFAQ  = 0,
    xmlhttp = 0,
    list_of_menus = 0,
    list_of_questions
    item_offset = new Array();

//Canvas and Slideshow Vars
var slides = 0,
    currentItem = 0,
    currentSlide = 0,
    currentGroup = 0,
    lastSlide = 0,
    slideshow = 0;

showAndroidToast("slideshow.js declarations complete");

function imgError(image) {
    image.onerror = "";
    image.src = "img/photos/placeholder.jpg";
    image.alt = "disabled";
    return true;
}


function toggleMenu(){
    showAndroidToast("executing toggleMenu()");

    d = new Date();
    if(d-menuLastSwitched > menuSwitchTime)
    {
        menuLastSwitched = d;
        menuDescription = $('#menuDescription');
        if(!menuDisplay) //Display the menu
        {
            //Populate the item menu
            showItems(currentGroup);
            showItem(currentGroup, currentItem-item_offset[currentGroup]);

            menuDisplay = true;
            menuLastSwitched = new Date();

            //Update CSS
            document.getElementById('slideshow').className='slideshowSmall';
            document.getElementById('descriptionBox').className='hiddenDB';
            document.getElementById('dbTip').innerText=("Press here to go back to the slideshow");

        }
        else //Display the slideshow
        {
            menuDisplay = false;
            menuLastSwitched = new Date();

            //update CSS
            document.getElementById('slideshow').className='slideshowFull';
            document.getElementById('descriptionBox').className='visibleDB';
            document.getElementById('dbTip').innerText=("Touch here for more information!");
        }    
    }
}

function closeMenu(){
    $('#menuSlides').eq(0).attr('class','slidesHidden');
    $('#slides').eq(0).attr('class','slidesVisible');
    menuSlidesActive = false;
    loadImage(currentSlide);
}

function showItems(groupNumber){
    $('#items li').remove();

    //Add the Item Group Header
    $('#items').append('<li id="menu" class="unselectedItem" style="font-size:150%; border-radius:25px; text-align:center">'+list_of_menus[groupNumber].attributes[0].childNodes[0].nodeValue+'</li>');
    //Add the Individual Items
    for(i=0; i< list_of_menus[groupNumber].childElementCount; i++){
        $('#items').append('<li id="menu" class="unselectedItem" onclick="showItem('+groupNumber+','+i+')">'+
            list_of_menus[groupNumber].childNodes[i*2+1].childNodes[1].textContent+'</li>');
    }
    //Add the Back button
    $('#items').append('<li id="menu" class="unselectedItem" onclick="showItem(0,-1)">Back</li>');

    $('#menus').eq(0).attr('class','hiddenMenus');
    $('#items').eq(0).attr('class','visibleItems');

    if(menuSlidesActive)
    {
        $('#menuSlides').eq(0).attr('class','slidesVisible');
        $('#slides').eq(0).attr('class','slidesHidden');
        currentGroup = groupNumber;
        loadImage(groupNumber);
    }
}

function showItem(groupNumber, itemNumber){    

    if(itemNumber == -1)
    {
        $('#menus').eq(0).attr('class','visibleMenus')
        $('#items').eq(0).attr('class','hiddenItems');

        $('#menuSlides').eq(0).attr('class','slidesVisible');
        $('#slides').eq(0).attr('class','slidesHidden');
        menuSlidesActive = true;
        loadImage(currentGroup);
    }
    else if (checkImage(item_offset[groupNumber] + itemNumber))
    {

        $('#menuSlides').eq(0).attr('class','slidesHidden');
        $('#slides').eq(0).attr('class','slidesVisible');
        menuSlidesActive = false;

        if($('#items li').eq(itemNumber+1).attr('class') != 'selectedItem' && itemNumber >=0)
        {
            $('#items li').eq(itemNumber+1).attr('class','selectedItem');
            $('#items li').eq(selectedItem).attr('class','unselectedItem');
            selectedItem = itemNumber+1;
            currentGroup = groupNumber;

            loadImage(item_offset[groupNumber] + itemNumber);
        }
    }
    else
    {
        $('#items li').eq(itemNumber+1).attr('class','selectedItem');
        $('#items li').eq(selectedItem).attr('class','unselectedItem');
        selectedItem = itemNumber+1;
        currentGroup = groupNumber;
    }
}



function getGroupByItem(itemNumber)
{
    for(g = 0; g < item_offset.length-1; g++)
    {
        if(itemNumber < item_offset[g+1])
            return g;
    }
}

function checkImage(x)
{
    var li             = slides.eq(x),
        image          = li.find('img');
    if(image[0].alt == "disabled")
        return false;
    return true;
}

function loadImage(x){
    d = new Date();
    menuLastSwitched = d;
    if(menuSlidesActive == true)
    {
        lastSlide.className= "slide";
        var nextSlide   = x;
        var li          = document.getElementById('menuSlides').childNodes[x+3];
        var image       = li.getElementsByTagName('img')[0];

        //Update Description box
        $("#dbTitle")[0].innerHTML=list_of_menus[x].getAttribute("title");
        $("#itemPrice")[0].innerHTML="";
        $("#itemPrice2")[0].innerHTML="";
        $("#itemText")[0].innerHTML=list_of_menus[x].getAttribute("description");

        //Update the active slide and last slide
        li.className="slideActive";
        lastSlide = li;

    }
    //Transition process for food items
    else if(currentItem != x || loading)
    {
        var nextSlide      = x;//currentSlide >= slides.length-1 ? 0 : currentSlide+1;
        currentGroup = getGroupByItem(x);


        var li             = slides.eq(currentSlide),
            image          = li.find('img'),
            descriptionBox = $('#descriptionBox').find("div"),
            menuBox        = $('#menuDescription').find("div"),
            nextItem       = x;
        
        //Update Description box
        descriptionBox.eq(0).html(list_of_items[nextItem].getElementsByTagName("title")[0].childNodes[0].nodeValue);
        menuBox.eq(0).html(list_of_items[nextItem].getElementsByTagName("price")[0].childNodes[0].nodeValue);
        menuBox.eq(1).html(list_of_items[nextItem].getElementsByTagName("price2")[0].childNodes[0].nodeValue);
        menuBox.eq(2).html(list_of_items[nextItem].getElementsByTagName("description")[0].childNodes[0].nodeValue);

        var next = slides.eq(nextSlide);

        if(fadeTransitions){
            image.fadeIn(function(){
                // Show the next slide below the current one:
                li[0].style.zIndex=1000;
                next[0].style.zIndex=900;
                next.show();
                
                if(!loading)
                {
                    li.fadeOut();
                }
                //If we've successfully loaded the first image, set loading to false (so we remove subsequent images appropriately)
                loading = false;
            });
        }
        else {
            // Use the plain version of the slideshow.
            li[0].className="slide";
            next[0].className="slideActive";
            if(!loading)
            {
                loading = false;
            }
        }
        currentItem = nextItem;
        currentSlide = nextSlide;
    }
}

function expandQuestion(faqNumber){
    popWindow = document.getElementById('popupBackground');
        popWindow.childNodes[1].childNodes[1].innerHTML=(list_of_questions[faqNumber].getElementsByTagName("q")[0].childNodes[0].nodeValue);
        popWindow.childNodes[1].childNodes[3].innerHTML=(list_of_questions[faqNumber].getElementsByTagName("a")[0].childNodes[0].nodeValue);
        popWindow.style.display="block";
}

function hideQuestion(){
    popWindow = document.getElementById('popupBackground');
        popWindow.style.display="none";
}


$(window).load(function(){    

    showAndroidToast("Javascript loaded");

    // XML Menu location
    $xmlFileLocation = "menu.xml",
    xmlDoc  = 0,
    xmlhttp = 0;
    loadXMLMenu();

    //Populate the menus
    list_of_questions = xmlFAQ.getElementsByTagName("question");
    for (q = 0; q < list_of_questions.length; q++){
        $('#faqs').append('<li id="faq" class="unselectedItem" onclick="expandQuestion('+q+')">'+
            list_of_questions[q].getElementsByTagName("q")[0].childNodes[0].nodeValue+'</li>');
    }


    list_of_menus = xmlDoc.getElementsByTagName("group"); 
    for (g = 0; g < list_of_menus.length; g++){
        item_offset[0] = 0;
        $('#menus').append('<li id="menu" class="unselectedItem" onclick="showItems('+g+')">'+
            list_of_menus[g].getAttribute("title")+'</li>')
        $('#menuSlides').append('<li id="slide" class="slide" ><img src="img/photos/'+
            list_of_menus[g].getAttribute("homeImage")+'" height="800" width="600" class="slideshowImageFull" alt="'+
            list_of_menus[g].getAttribute("title")+'" /></li>');
        //offset for this group = total number of items in the previous groups
        item_offset[g+1] = item_offset[g] + list_of_menus[g].childElementCount;
    }

    //Populate the list of slides
    list_of_items = xmlDoc.getElementsByTagName("item");
    for (i = 0; i < list_of_items.length; i++){
        $('#slides').append('<li id="slide" class="slide" ><img src="img/photos/'+
            list_of_items[i].getElementsByTagName("image")[0].childNodes[0].nodeValue+'" height="800" width="600" class="slideshowImageFull" alt="'+
            list_of_items[i].getElementsByTagName("image")[0].childNodes[0].nodeValue+'" onerror="imgError(this);" /></li>');
    }

    slides = $('.slide'),
    currentItem = 0,
    currentSlide = 0,
    slideshow = {width:0,height:0};

    window.setInterval(function() {
        if(!menuDisplay)
        {

            d = new Date();
            if(d-menuLastSwitched > menuSwitchTime)
            {   
                var x=xmlDoc.getElementsByTagName("item");   
                var nextItem = currentItem >= x.length-1 ? 0 : currentItem+1;
                while(!checkImage(nextItem)) nextItem++;
                loadImage(nextItem);
            }
            menuLastSwitched = d;
        }
        else
        {
            d = new Date();
            if(d-menuLastSwitched > menuIdleTime)
                toggleMenu();
            menuLastSwitched = d;
        }
    }, 10000);

    images = document.getElementsByClassName('slideshowImageFull') //.each(function(){
    for(x = 0; x < images.length; x++)
    {

        if(!slideshow.width){
            // Saving the dimensions of the first image:
            slideshow.width = images[x].width;
            slideshow.height = images[x].height;
        }
    }

    //Add swipe recognition
    $("#slideshow").touchwipe({
         wipeRight: function() { 
            if(!menuSlidesActive)
            {
                nextImage = currentItem-1;
                while(nextImage < 0 || !checkImage(nextImage)){
                    if(nextImage < 0) 
                        nextImage = list_of_items.length-1;
                    else
                        nextImage--;
                }
                loadImage(nextImage);
                menuLastSwitched = new Date();
            }
        },
         wipeLeft: function() {
            if(!menuSlidesActive)
            {
                nextImage = currentItem + 1;
                while(nextImage > list_of_items.length-1 || !checkImage(nextImage)){
                    if(nextImage > list_of_items.length-1)
                        nextImage = 0;
                    else
                        nextImage++;
                }
                loadImage(nextImage);
                menuLastSwitched = new Date();
            }
        },
         wipeUp: function() { return; },
         wipeDown: function() { return; },
         min_move_x: 20,
         min_move_y: 20,
         preventDefaultEvents: true
    });

    function loadXMLMenu(){
                
        //Update the XML File
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET","menu.xml",false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML; 

        xmlhttp.open("GET","faq.xml",false);
        xmlhttp.send();
        xmlFAQ=xmlhttp.responseXML;

    }

    loadImage(0);
    $('#dbTip').eq(0).html("Touch here for more information!");

});
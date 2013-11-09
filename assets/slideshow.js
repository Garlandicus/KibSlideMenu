//Global Variables
var loading = true;
var menuDisplay = false;
var selectedItem = -1;
var menuSwitchTime = 1000;
var menuLastSwitched  = 0;

var whiteSpaceBoarderHeight = 100;
var whiteSpaceBoarderWidth = 100;
var pictureWHRatio = 1.25;
var pictureWHRatioFix = 0;
var smallPictureHeight=0;
var smallPictureWidth=0;
var bigPictureHeight=0;
var bigPictureWidth=0;
var descriptionBoxHeight = 350;
var descriptionBoxLeft = 25;
var descriptionBoxHeightExpanded = 325;
var menuDescriptionHeight = 300;
var leftMenuWidth = 200;
var rightMenuWidth = 200;
var faqWindowHeight = 100;
var faqWindowWidth = 200;


// XML Menu location and Vars
var $xmlFileLocation = "menu.xml",
    xmlDoc  = 0,
    xmlFAQ  = 0,
    xmlhttp = 0,
    list_of_menus = 0,
    list_of_questions
    item_offset = new Array();

//Canvas and Slideshow Vars
var supportCanvas = 0;
var slides = 0,
    currentItem = 0,
    currentSlide = 0,
    currentGroup = 0,
    slideshow = 0;

showAndroidToast("slideshow.js declarations complete");


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

function showItems(groupNumber){
    $('#items li').remove();

    $('#items').append('<li id="menu" class="unselectedItem" style="font-size:150%; border-radius:25px; text-align:center">'+list_of_menus[groupNumber].attributes[0].childNodes[0].nodeValue+'</li>');
    for(i=0; i< list_of_menus[groupNumber].childElementCount; i++){
        $('#items').append('<li id="menu" class="unselectedItem" onclick="showItem('+groupNumber+','+i+')">'+
            list_of_menus[groupNumber].childNodes[i*2+1].childNodes[1].textContent+'</li>');
    }
    $('#items').append('<li id="menu" class="unselectedItem" onclick="showItem(0,-1)">Back</li>');

    $('#menus').eq(0).attr('class','hiddenMenus');
    $('#items').eq(0).attr('class','visibleItems');
}

function showItem(groupNumber, itemNumber){
    if($('#items li').eq(itemNumber+1).attr('class') != 'selectedItem')
    {
        $('#items li').eq(itemNumber+1).attr('class','selectedItem');
        $('#items li').eq(selectedItem).attr('class','unselectedItem');
        selectedItem = itemNumber+1;
        currentGroup = groupNumber;
    }

    if(itemNumber == -1)
    {
        $('#menus').eq(0).attr('class','visibleMenus')
        $('#items').eq(0).attr('class','hiddenItems');
    }
    else
    {
        loadImage(item_offset[groupNumber] + itemNumber);
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

function loadImage(x){
    if(currentItem != x || loading)
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

        if(/*supportCanvas*/false){ //disabling fancy animations

            // This browser supports canvas, fade it into view:

            image.fadeIn(function(){

                // Show the next slide below the current one:
                li[0].style.zIndex=1000;
                next[0].style.zIndex=900;
                next.show();
                
                if(!loading)
                {
                    // Fade the current slide out of view:
                    li.fadeOut(function(){                        
                        //Just fade out man
                    })
                }
                //If we've successfully loaded the first image, set loading to false (so we remove subsequent images appropriately)
                loading = false;
            });
        }
        else {

            // This browser does not support canvas.
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
            list_of_questions[q].childNodes[1].childNodes[0].nodeValue+'</li>');
    }


    list_of_menus = xmlDoc.getElementsByTagName("group"); 
    for (g = 0; g < list_of_menus.length; g++){
        item_offset[0] = 0;
        $('#menus').append('<li id="menu" class="unselectedItem" onclick="showItems('+g+')">'+
            list_of_menus[g].attributes[0].childNodes[0].nodeValue+'</li>')
        //offset for this group = total number of items in the previous groups
        item_offset[g+1] = item_offset[g] + list_of_menus[g].childElementCount;
    }

    //Populate the list of slides
    list_of_items = xmlDoc.getElementsByTagName("item");
    for (i = 0; i < list_of_items.length; i++){
        $('#slides').append('<li id="slide" class="slide" ><img src="img/photos/'+
            list_of_items[i].childNodes[9].textContent+'" height="800" width="600" class="slideshowImageFull" alt="'+
            list_of_items[i].childNodes[1].textContent+'" /></li>');
        //$('.slide').eq(i).hide();
    }

    // Testing wether the current browser supports the canvas element:
    supportCanvas = 'getContext' in document.createElement('canvas');

    // The canvas manipulations of the images are CPU intensive,
    // this is why we are using setTimeout to make them asynchronous
    // and improve the responsiveness of the page.

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
                loadImage(nextItem);
            }
            menuLastSwitched = d;
        }
    }, 10000);

    //setTimeout(function(){

        if(supportCanvas){
            /*loadImagesIntoMenu();
            var x=xmlDoc. ////////LEFT OFF HERE, TRY LOADING ALL THE IMAGES INTO THE SLIDESHOW BEFORE CREATING THE CANVAS
            $()*/
            images = document.getElementsByClassName('slideshowImageFull') //.each(function(){
            for(x = 0; x < images.length; x++)
            {

                if(!slideshow.width){
                    // Saving the dimensions of the first image:
                    slideshow.width = images[x].width;
                    slideshow.height = images[x].height;
                }

                // Rendering the modified versions of the images:                
                createCanvasOverlay(images[x]);
            }
        }

        //Add swipe recognition
        $("#slideshow").touchwipe({
             wipeRight: function() { loadImage(currentItem <= 0 ? x.length-1 : currentItem-1); menuLastSwitched = new Date();},
             wipeLeft: function() { loadImage(currentItem >= x.length-1 ? 0 : currentItem+1); menuLastSwitched = new Date();},
             wipeUp: function() { alert("up"); },
             wipeDown: function() { alert("down"); },
             min_move_x: 20,
             min_move_y: 20,
             preventDefaultEvents: true
        });

/*
        $('#slideshow .arrow').click(function(){
            var x=xmlDoc.getElementsByTagName("item"); 
            var nextIndex = 0;  

            // Depending on whether this is the next or previous
            // arrow, calculate the index of the next slide accordingly. 

            if($(this).hasClass('next')){
                nextItem = currentItem >= x.length-1 ? 0 : currentItem+1;
                
            }
            else {
                nextItem = currentItem <= 0 ? x.length-1 : currentItem-1;
            }
            loadImage(nextItem);
        });
*/

    //},100);

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



    // This function takes an image and renders
    // a version of it similar to the Overlay blending
    // mode in Photoshop.

    function createCanvasOverlay(image){

        var canvas           = document.createElement('canvas'),
            canvasContext    = canvas.getContext("2d");

        // Make it the same size as the image
        canvas.width = parseInt(slideshow.width,10);
        canvas.height = parseInt(slideshow.height,10);

        // Drawing the default version of the image on the canvas:
        canvasContext.drawImage(image,0,0);

        // Taking the image data and storing it in the imageData array:
        var imageData    = canvasContext.getImageData(0,0,canvas.width,canvas.height);
        var data        = imageData.data;

        // Loop through all the pixels in the imageData array, and modify
        // the red, green, and blue color values.

        for(var i = 0,z=data.length;i<z;i++){

            // The values for red, green and blue are consecutive elements
            // in the imageData array. We modify the three of them at once:

            data[i] = ((data[i] < 128) ? (2*data[i]*data[i] / 255) :
                        (255 - 2 * (255 - data[i]) * (255 - data[i]) / 255));
            data[++i] = ((data[i] < 128) ? (2*data[i]*data[i] / 255) :
                        (255 - 2 * (255 - data[i]) * (255 - data[i]) / 255));
            data[++i] = ((data[i] < 128) ? (2*data[i]*data[i] / 255) :
                        (255 - 2 * (255 - data[i]) * (255 - data[i]) / 255));

            // After the RGB channels comes the alpha value, which we leave the same.
            ++i;
        }

        // Putting the modified imageData back on the canvas.
        canvasContext.putImageData(imageData,0,0,0,0,imageData.width,imageData.height);

        // Inserting the canvas in the DOM, before the image:
        //image.parentNode.insertBefore(canvas,image);
    }

    loadImage(0);
    $('#dbTip').eq(0).html("Touch here for more information!");
    //End of window load function ====================================================================================================//


});
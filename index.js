
let usertab=document.querySelector('#yourtab');
let searchtab=document.querySelector('#searchtab');


let weathercontainers=document.querySelector('#weathercontainers');

let grantlocationcontainer=document.querySelector('#grantlocationcontainer');
let searchformcontainer=document.querySelector('#searchformcontainer');
let searchformdiv=document.querySelector('#searchformdiv');
let loadingscreencontainer=document.querySelector('#loadingscreencontainer');
let yourtabcontainer=document.querySelector('#yourtabcontainer');

let parametercontainer=document.querySelector('#parametercontainer');

let grantbutton=document.querySelector('#grantbutton');


let currenttab=usertab;
const API_KEY="896c47deb095014730003b0e976aeda5";

currenttab.classList.add("current-tab"); 
//* 2)
function switchtab(clickedtab)
{
    if(clickedtab!=currenttab)
        {
            currenttab.classList.remove("current-tab");
            currenttab=clickedtab;
            currenttab.classList.add("current-tab"); 

            if(!searchformdiv.classList.contains("active"))
                {
                    grantlocationcontainer.classList.remove("active");
                    yourtabcontainer.classList.remove("active");
                    loadingscreencontainer.classList.remove("active");

                    
                    searchformdiv.classList.add("active");
                }
               else 
                { 
                    searchformdiv.classList.remove("active");
                    yourtabcontainer.classList.remove("active");
                    getfromsessionstorage();
                }
        }
}

//* 1.
usertab.addEventListener('click',function()
{
    switchtab(usertab);
});

searchtab.addEventListener('click',function()
{
    switchtab(searchtab);
});

//* 3 To check whether the coordinates are already present in session storage or not
function getfromsessionstorage()
{
    const localcoorinates=sessionStorage.getItem('user-coordinates');
    if(!localcoorinates) 
        {
            grantlocationcontainer.classList.add("active");
        }
    else 
    {
        const coordinates=JSON.parse(localcoorinates);
        fetchuserweather(coordinates);
    }
}
 //* 4
async function fetchuserweather(coordinates)
{
    const {lat,lon}=coordinates;

    grantlocationcontainer.classList.remove('active');
    loadingscreencontainer.classList.add('active');
    
   
    try
    {
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=896c47deb095014730003b0e976aeda5&units=metric`); 
    const output =await response.json();

    loadingscreencontainer.classList.remove('active');
    yourtabcontainer.classList.add('active');

    renderweatherinfo(output);

    }
    catch(er)
    {
        loadingscreencontainer.classList.remove('active');
        console.log(er);
    }
    }


//*5
    function renderweatherinfo(output)
    {

        const cityname=document.querySelector('#cityname');
        const countryflag=document.querySelector('#countryflag');

        const weathercondition=document.querySelector('#weathercondition');
        const weathericon=document.querySelector('#weathericon');
        const temperature=document.querySelector('#temperature');

        const speed=document.querySelector('#speed');
        const humidityvalue=document.querySelector('#humidityvalue');
        const cloudvalue=document.querySelector('#cloudvalue');

        
        cityname.innerText=output?.name;

        countryflag.src=`https://flagcdn.com/144x108/${output?.sys?.country.toLowerCase()}.png`; //it is a image that thats why source

        weathercondition.innerText=output?.weather?.[0]?.description;        //! doubt on indexing
        weathericon.src=`https://openweathermap.org/img/w/${output?.weather?.[0]?.icon}.png`;
        temperature.innerText=output?.main?.temp;


        speed.innerText=output?.wind?.speed;
        humidityvalue.innerText=output?.main?.humidity;
        cloudvalue.innerText=output?.clouds?.all;
    }


    function getlocation()
    {
        if(navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(showposition);
            }
            else
            {
            alert("NO Geolocation Support Available");
            }
    }

    function showposition(position)
    {
        const usercoordinates=
        {
            lat:position.coords.latitude,
            lon:position.coords.longitude
        }
        sessionStorage.setItem('user-coordinates',JSON.stringify(usercoordinates));
        fetchuserweather(usercoordinates);
    }

    //* 6 
    grantbutton.addEventListener('click',getlocation);

    //*9
   async function fetchsearchweather(cityname2)
    {
        loadingscreencontainer.classList.add('active');
        yourtabcontainer.classList.remove('active');
        grantlocationcontainer.classList.remove('active');
        try
        {
            const response2=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname2}&appid=896c47deb095014730003b0e976aeda5&units=metric`);
            const output2=await response2.json();
            loadingscreencontainer.classList.remove('active');
            yourtabcontainer.classList.add('active');
            renderweatherinfo(output2);
        }
        catch(er)
        {
            yourtabcontainer.classList.remove('active');
            grantlocationcontainer.classList.remove('active');
            loadingscreencontainer.classList.remove('active');
        }
    }

    //*8
    let forminput=document.querySelector('#forminput');
    //apply prevent default on whole form
    searchformcontainer.addEventListener('submit',function(event)
    {
        event.preventDefault();
        const cityname2=forminput.value;
        if(cityname2==="")
            {
                return;
            }
        else
        {
            fetchsearchweather(cityname2);
        }
    })
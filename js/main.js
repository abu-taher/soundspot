var API_KEY = 'BQDTFydJmcREN-pGwqAokeFS0VROJM8RkokeXNnbX41KaqCse7aDpMOGqKYUNPFS_5zLjCcMaYImZY0twWlXz5vnwAHyxDMqyK7FhBzg7FH6Dno73sg9XtI3ZVtLQWaKxyhesCxRTu9QR_P2miYdymmoBT54SsE';
/*
مثال من هذا الموقع 
Spotify: https://developer.spotify.com/console/get-search-item/?q=cheb%20khaled&type=artist&market=&limit=&offset=
عند الضغط على زر:
Try It
سترى الرد من الخادم

ولفهم كيفية إرسال الطلب يجب فتح هذا الرابط
https://developer.spotify.com/documentation/web-api/reference/search/search/
*/
const API_ENDPOINT = 'https://api.spotify.com/v1/search';

const params = getHashParams();

if(params.access_token){
    setCookie('accessToken', params.access_token)
    document.location.hash = ''
}

const renderData = (res, searchType) => {
    const resList = res[Object.keys(res)[0]]
    document.querySelector('.searchResults').classList.remove('is-hidden')
    document.querySelector('.musicList').innerHTML = resList.items.map(item => {
        let tagline;
        switch(searchType){
            case 'artist':
                tagline = item.followers.total
                break
            case 'playlist':
                tagline = item.owner.display_name
                break
            default:
                tagline = item.artists[0].name
        }

        let image = 'https://image.shutterstock.com/image-vector/picture-icon-vector-260nw-452923639.jpg'
        if(searchType==='track'){
            image = item.album.images[0].url
        } else if(searchType !=='track' && item.images.length > 0) {
            image = item.images[0].url
        }

        return `<li>
        <!--يفضل وضع الصورة كخلفية حتى نستطيع تغيير الحجم من ناحية العرض والطول في نفس الوقت عن طريق background-size-->
        <span
          class="trackPoster"
          style="background-image: url(${image});"
        >
        </span>
        <span class="trackDetails">
          <h4 class="trackTitle">${item.name}</h4>
          <h5 class="trackArtist">${tagline}</h5>
        </span>
        <span class="trackActions">
          <button class="like">
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 3C8.33 1.268 6.453 0 4.5 0C1.957 0 0 1.932 0 4.5C0 8.029 3.793 10.758 9 16C14.207 10.758 18 8.029 18 4.5C18 1.932 16.043 0 13.5 0C11.545 0 9.67 1.268 9 3Z"
              />
            </svg>
          </button><a class='play' href='${item.external_urls.spotify}' target='_blank'></a></span>
      </li>`
    }).join('')
}

document.querySelector('.submitSearch').addEventListener('click', event => {
    event.preventDefault();
    const query = document.querySelector('#searchQuery').value
    const searchType = document.querySelector('#searchType').value
    const limit = 9

    if(query){
        fetch(`${API_ENDPOINT}?q=${query}&type=${searchType}&limit=${limit}`, {
            headers:{
                'Authorization':`Bearer ${getCookie('accessToken')}`
            }
        }).then(res => res.json())
        .then(res => {
            if(res.error){
                throw res.error
            }
            renderData(res, searchType)
        })
        .catch(err => {
            if(err.status === 400 || err.status === 401){
                document.location.href = 'http://localhost:8888'
            } else {
                console.log(err)
            }
        })
    }else{
        return
    }

})


//list or grid
document.querySelector('.switch.grid').addEventListener('click', () => {
    console.log(222)
    document.querySelector('.switch.grid').classList.add('is-active')
    document.querySelector('.switch.list').classList.remove('is-active')
    document.querySelector('.musicList').classList.add('is-grid')
    document.querySelector('.musicList').classList.remove('is-list')
})
document.querySelector('.switch.list').addEventListener('click', () => {
    document.querySelector('.switch.list').classList.add('is-active')
    document.querySelector('.switch.grid').classList.remove('is-active')
    document.querySelector('.musicList').classList.add('is-list')
    document.querySelector('.musicList').classList.remove('is-grid')
})
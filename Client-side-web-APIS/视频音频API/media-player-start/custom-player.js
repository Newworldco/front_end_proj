// <video>元素
const media = document.querySelector('video');
const controls = document.querySelector('.controls');
//四个按钮
const play = document.querySelector('.play');
const stop = document.querySelector('.stop');
const rwd = document.querySelector('.rwd');
const fwd = document.querySelector('.fwd');
//计时器相关的部分
const timerWrapper = document.querySelector('.timer');
const timer = document.querySelector('.timer span');
const timerBar = document.querySelector('.timer div');

//移除原有的 control，显示新的control
media.removeAttribute('controls');
controls.style.visibility = 'visible';

//video 的控制按钮
play.addEventListener('click',playPauseMedia);

function playPauseMedia() {
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    if(media.paused) {
      play.setAttribute('data-icon','u');
      media.play();
    } else {
      play.setAttribute('data-icon','P');
      media.pause();
    }
  }
//暂停视频
stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);

function stopMedia() {
    rwd.classList.remove('active');
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    media.pause();
    //设置视频到起始位置
    media.currentTime = 0;
    play.setAttribute('data-icon','P');
}

//快退快进
rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);

let intervalFwd;
let intervalRwd;

function mediaBackward() {
    //如果俩按钮同时按会崩溃，所以要清楚另一个按钮的属性
    clearInterval(intervalFwd);
    fwd.classList.remove('active');
    //如果按过了，就清除属性，然后正常播放
    if(rwd.classList.contains('active')) {
        rwd.remove('active');
        clearInterval(intervalRwd);
        media.play();
    } else {
        rwd.classList.add('active');
        media.pause();
        intervalRwd = setInterval(windBackward, 200);
    }
}

function mediaForward() {
    clearInterval(intervalRwd);
    rwd.classList.remove('active');
  
    if(fwd.classList.contains('active')) {
      fwd.classList.remove('active');
      clearInterval(intervalFwd);
      media.play();
    } else {
      fwd.classList.add('active');
      media.pause();
      intervalFwd = setInterval(windForward, 200);
    }
  }

function windBackward() {
    if(media.currentTime <= 3) {
        // rwd.classList.remove('active');
        // clearInterval(intervalRwd);
        stopMedia();
    } else {
        media.currentTime -= 3;
    }
}

function windForward() {
    if(media.currentTime >= media.duration - 3) {
    //   fwd.classList.remove('active');
    //   clearInterval(intervalFwd);
      stopMedia();
    } else {
      media.currentTime += 3;
    }
  }

  //视频时间的显示
  //为了准确显示，要时刻调用setTime() 当 timeupdate 事件开启时
  media.addEventListener('timeupdate', setTime);
  
  function setTime() {
      let minutes = Math.floor(media.currentTime / 60);
      let seconds = Math.floor(media.currentTime - minutes * 60);
      let hours = Math.floor(media.currentTime / 3600);
      let minuteValue;
      let secondValue;
      let hourValue;

      if (minutes < 10) {
        minuteValue = '0' + minutes;
      } else {
        minuteValue = minutes;
      }
    
      if (seconds < 10) {
        secondValue = '0' + seconds;
      } else {
        secondValue = seconds;
      }
      if (hours < 10) {
          hourValue = '0' + hours;
      } else {
          hourValue = hours;
      }
    
      let mediaTime = hourValue + ':' + minuteValue + ':' + secondValue;
      timer.textContent = mediaTime;
      
      //进度条等于时间的百分比
      let barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
      timerBar.style.width = barLength + 'px';

  }

//添加点击功能
timerBar.addEventListener('click', function(e) {
    console.log(e.clientX) + ',' + console.log(e.clientY);
    barRect = timerBar.getBoundingClientRect();
    timeWide = barRect.width - (barRect.rigth - e.clientX);
    barTime = Math.floor(media.duration * (timeWide / barRect.width))
    media.currentTime = barTime;
    media.play()
});
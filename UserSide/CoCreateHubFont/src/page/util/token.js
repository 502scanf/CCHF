function setToken(token){
    localStorage.setItem('token', token)
}

function  getToken() {
    return localStorage.getItem('token')
}
function loginTime(loginTime){
    localStorage.setItem('loginTime', loginTime)
}
function getLoginTime(){
    return localStorage.getItem('loginTime')
}
function removeToken(){
    localStorage.removeItem('token')
}

function tokenOutTime(createTime){
    const currentTime = new Date().getTime()
    return currentTime - createTime > 115 * 60 * 1000;

}

export {
    setToken,
    getToken,
    removeToken,
    tokenOutTime,
    loginTime,
    getLoginTime
}

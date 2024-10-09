import userLogo from '../../lib/pageSource/用户管理.png'
function Home(){

  function toUserPage(){
    Taro.navigateTo({
      url: ''
    })
  }

  return (
    <div className={"Home"}>
      <div className={"user"}>
        <img
          className={"uLogo"}
          style="
             width: 50px;
             height: 50px;
             borderRadius: 50%;
             backgroundColor: #969595;
             "
             src={userLogo} alt={userLogo}
          onClick={toUserPage}
        />
      </div>
    </div>
  )
}

export default Home;

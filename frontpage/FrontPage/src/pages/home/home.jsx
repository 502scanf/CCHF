import userLogo from '../../lib/pageSource/用户.png'
import './home.scss'
import Taro from "@tarojs/taro";
import workLogo from '../../lib/pageSource/blueWork.png'
import documentLogo from '../../lib/pageSource/文件 (2).png'
import managementLogo from '../../lib/pageSource/管理 (1).png'
import emptyLogo from '../../lib/pageSource/3369473.jpg'
function Home(){

  function toUserPage(){
    Taro.navigateTo({
      url: '/pages/user/user'
    }).then(() => {
      console.log("success")
    }).catch(err => {
      console.error("failed: ",err)
    })
  }

  function toWorkPage(){
    Taro.navigateTo({
      url: '/pages/work/work'
    }).then(()=> {
      console.log("success")
    }).catch(err => {
      console.error("failed : ",err)
    })
    }

  function toManagementPage(){
    Taro.navigateTo({
      url: '/pages/management/management'
    }).then(()=>{
      console.log("success")
    }).catch(err =>{
      console.error("failed: ", err)
    })
  }
  function toDocumentPage(){
    Taro.navigateTo({
      url: '/pages/document/document'
    }).then(()=>{
      console.log("success")
    }).catch(err =>{
      console.error("failed: ", err)
    })
  }

  return (
    <div className={"Home"}>
      <div className={"user"} onClick={toUserPage} >
        <img
          className={"uLogo"}
          src={userLogo} alt={userLogo}
        />
        <span className={"userName"}>用户5bc2a3e</span>
        <span className={"loginTip"}>请登录</span>
      </div>

      <div className={"Content"}>
        <div className={"functionList"}>
          <div className={"function"} onClick={toWorkPage}>
            <img src={workLogo} alt={workLogo}/>
            <span>工作区</span>
          </div>
          <div className={"function"} onClick={toManagementPage}>
            <img src={managementLogo} alt={managementLogo}/>
            <span>管理区</span>
          </div>
          <div className={"function"} onClick={toDocumentPage}>
            <img src={documentLogo} alt={documentLogo}/>
            <span>工作文件</span>
          </div>
        </div>
        <div className={"middleContent"}>
          <div className={"emptyTip"}>
            <img src={emptyLogo} alt={emptyLogo}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;

import './management.scss'
import searchPhoto from '../../lib/pageSource/搜索.svg'
import donePhoto from '../../lib/pageSource/已完成.svg'
import pendingPhoto from '../../lib/pageSource/待完成.svg'
import addWorkPhoto from '../../lib/pageSource/add3.svg'
import Taro from "@tarojs/taro";
function Management(){

  function toAdd(){
    Taro.navigateTo({
      url: '/pages/work/work'
    }).then(() =>{
      console.log("success")
    }).catch(err =>{
      console.error("failed: ", err)
    })
  }

  return (
    <div className={"management"}>
      <div className={"topSearch"}>
        <div className={"search"} >
          <img src={searchPhoto} alt={searchPhoto}/>
          <input className={"input"} placeholder={"  搜索工作区"}/>
        </div>
      </div>
      <div className={"mFunctionList"}>
        <div className={"mFunction"}>
          <img src={pendingPhoto} alt={pendingPhoto}/>
          <div className={"tip"}>
            <span className={"h1"}>待完成</span>
            <span className={"h2"}>还没有完成的工作区域</span>
          </div>

        </div>
        <div className={"mFunction"}>
          <img src={donePhoto} alt={donePhoto}/>
          <div className={"tip"}>
            <span className={"h1"}>已完成</span>
            <span className={"h2"}>已经完成的工作区域</span>
          </div>
        </div>
      </div>
      <img className={"addWork"} src={addWorkPhoto} alt={addWorkPhoto} onClick={toAdd}/>
    </div>
  )
}

export default Management

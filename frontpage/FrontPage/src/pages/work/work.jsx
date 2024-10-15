import './work.scss'
import DefineTopStyle from "../component/defineTopStyle";
import addDocument from "../../lib/pageSource/addDocument.svg"
function Work(){
  return (
    <div className={"work"}>
      <DefineTopStyle topName={"工作区"} backgroundPhoto={" "}/>
      <div className={"createWork"}>
        <div className={"workDetail"}>
          <span>名称 ：</span>
          <div className={"nameInput"}>
            <input placeholder={"填写工作区名称"}/>
          </div>
        </div>
        <div className={"workDetail"}>
          <span>任务简介 ：</span>
          <textarea placeholder={"填写工作区任务简介"}/>
        </div>
        <div className={"workDetail"}>
          <span>工作文件 :</span>
          <img src={addDocument} alt={addDocument}/>
        </div>
      </div>
      <div className={"wButton"}>
        <button>创建工作区</button>
      </div>
    </div>
  )
}

export default Work

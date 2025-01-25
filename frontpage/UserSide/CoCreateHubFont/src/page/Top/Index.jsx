import React from "react";
import './top.css'
import logo from '@assets/logo.png'
import {useNavigate} from "react-router-dom";
const ReactNativeHome = () => {
  const navigate = useNavigate()
  return (
    <div className="react-native-home">
      {/* Header Section */}
      <header className="header">
        <div className="headerLogo">
          <img src={logo} alt={logo} className="logo" />
          <span>CoCreateHub 协创空间</span>
        </div>
        <nav className="header-nav">
          <a href="/login">登录</a>
        </nav>
      </header>

      <main className="main-content">
        <div className="main-title">
          <h1>协创空间</h1>
          <p>
            CoCreateHub 协创空间为团队提供高效协作平台，
            支持创建专属工作房间、文件管理和多人实时协同编辑。
          </p>
          <p>
            通过模块化房间和协同编辑功能，
            协创空间提升团队效率，整合文件修改与交流，简化工作流程。
          </p>
        </div>
        <div className="main-buttons">
          <button className="start" onClick={()=>navigate('/')}>开始使用</button>
          <button className="know" onClick={()=>navigate('/Helper')}>了解更多</button>
        </div>
      </main>


    </div>
  );
};

export default ReactNativeHome;

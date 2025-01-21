import React from "react";
import { Button } from "antd";
import "./App.css";

const ReactNativeHome = () => {
  return (
    <div className="react-native-home">
      {/* Header Section */}
      <header className="header">
        <div className="header-logo">
          <img src={require("./assets/logo.png")} alt="React Logo" className="logo" />
          <span>React Native 中文网</span>
        </div>
        <nav className="header-nav">
          <a href="#">登录</a>
          <a href="#">关于</a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main-content">
        <div className="main-title">
          <h1>富文本编辑器</h1>
          <p>
            React Native 将原生开发的最佳部分与 React
            相结合，致力于成为构建用户界面的顶尖 JavaScript 框架。
          </p>
          <p>
            随时都可以把 React Native 无缝集成到你已有的 Android 或 iOS
            项目，当你也可以完全从头焕然一新地重写。
          </p>
        </div>
        <div className="main-buttons">
          <Button type="primary" size="large" block>
            开始使用
          </Button>
          <Button type="primary" size="large" block>
            搭建环境
          </Button>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2025 Foster. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ReactNativeHome;

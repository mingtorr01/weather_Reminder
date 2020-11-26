import React, { Component } from "react";
import "./main.css";
import umb from "./umbrella.png";
import Main2 from "./main2";
import Raining from "../login/rain";
import Rain from "./rain.png";
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: <button onClick={this.onclick}>신청하기</button>,
      progress2: "",
      main: <Main2 tounder={this.tounder} />,
      data: "",
      cart: [],
    };
  }
  componentWillMount() {
    if (localStorage.getItem("user") === null) {
      window.location.href = "/";
      alert("로그인하세요");
    }
  }

  tounder = (box) => {
    this.setState({
      cart: box,
    });
    console.log(box);
  };
  onclick = () => {
    console.log(localStorage.getItem("user"));
    if (this.state.cart.length === 0) {
      alert("이메일을 받을 시간과 지역을 선택하세요!!");
    } else {
      this.setState(
        {
          progress: <button onClick={this.onclickcancle}>취소하기</button>,
          progress2: <div className="circle"></div>,
          main: "",
          cart: this.state.cart.concat(localStorage.getItem("user")),
          data: (
            <p>
              선택한시간 {this.state.cart[0]}:00 지역:{this.state.cart[1]}
              {this.state.cart[2]}
              {this.state.cart[3]}
            </p>
          ),
        },
        this.showdata
      );
    }
  };

  showdata = () => {
    fetch("http://localhost:3001/storeData", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(this.state.cart),
    });
  };

  cancelstate = () => {
    const box = [localStorage.getItem("user")];
    fetch("http://localhost:3001/cancelstate", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(box),
    });
  };

  onclickcancle = () => {
    this.setState(
      {
        progress: <button onClick={this.onclick}>신청하기</button>,
        progress2: "",
        main: <Main2 tounder={this.tounder} />,
        data: "",
      },
      this.cancelstate
    );
  };

  logout = () => {
    localStorage.removeItem("user"); //로컬스토리지 지우기
    window.location.href = "/";
  };

  render() {
    return (
      <div className="main">
        <Raining />

        <div className="main1">
          <p style={{ marginRight: 10 }}>우산 알리미</p>
          <img src={umb} height="30px" width="30px" />
        </div>
        <div className="main2">
          {this.state.data}
          {this.state.main}
        </div>
        <div id="logout">
          <button onClick={this.logout}>로그아웃</button>
        </div>
        <div className="main3">
          {this.state.progress}
          {this.state.progress2}
        </div>
      </div>
    );
  }
}

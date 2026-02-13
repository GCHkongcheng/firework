import { useState, useEffect } from "react";
import { Fireworks } from "@fireworks-js/react";

function App() {
  // 1. 判断是否是手机端 (简单的屏幕宽度检测)
  // 如果宽度小于 768px，认为是手机
  const isMobile = window.innerWidth < 768;

  // 祝福语列表 (手机上换行也可以，但我们用CSS控制大小)
  const messages = [
    "✨ Tap Anywhere! ✨", // 手机上显示 "Tap" 更自然
    "新年快乐！Happy New Year! 🎆",
    "代码无 Bug，上线一次过！ 🐛🚫",
    "身体健康，万事如意！ ❤️",
    "前程似锦，未来可期！ 🚀",
    "保持热爱，奔赴山海 🌊",
    "愿你眼里有光，心中有爱 ✨",
  ];

  const [text, setText] = useState(messages[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const changeCycle = () => {
      setIsVisible(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setText(messages[randomIndex]);
        setIsVisible(true);
      }, 500);
    };

    const interval = setInterval(changeCycle, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        // 🌟 重点适配 1：使用 dvh (Dynamic Viewport Height)
        // 解决手机浏览器地址栏遮挡底部的问题，如果不支持则回退到 100vh
        height: "100dvh",
        background: "#000",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <Fireworks
        options={{
          hue: { min: 0, max: 360 },
          delay: { min: 20, max: 40 },
          rocketsPoint: { min: 50, max: 50 },
          opacity: 0.5,
          acceleration: 1.05,
          friction: 0.97,
          gravity: 1.5,

          // 🌟 重点适配 2：性能优化
          // 电脑端 60 个粒子，手机端只开 30 个，防止卡顿
          particles: isMobile ? 30 : 60,
          trace: isMobile ? 2 : 3, // 手机上拖尾短一点，减少渲染压力
          explosion: isMobile ? 4 : 6, // 手机上爆炸范围小一点
          intensity: 35,
          flickering: 50,
          lineStyle: "round",

          mouse: {
            click: true,
            max: 5,
          },
          sound: {
            enabled: true,
            files: [
              "https://fireworks.js.org/sounds/explosion0.mp3",
              "https://fireworks.js.org/sounds/explosion1.mp3",
              "https://fireworks.js.org/sounds/explosion2.mp3",
            ],
            // 手机音量稍微调大一点
            volume: { min: 5, max: 20 },
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
          background: "#000",
          zIndex: 1,
        }}
      />

      {/* 文字层 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          pointerEvents: "none",
          textShadow: "0 0 20px rgba(255,255,255,0.9)",
          zIndex: 10,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",

          // 🌟 重点适配 3：响应式文字排版
          // 允许文字换行，防止撑破屏幕
          whiteSpace: "normal",
          width: "90%", // 左右留出 5% 的边距
          wordBreak: "keep-all", // 尽量不在单词/词组中间断开（针对中文优化）

          // 🌟 重点适配 4：智能字体大小 (clamp 函数)
          // 最小 1.5rem (手机)，最大 3rem (电脑)，中间自动根据视口宽度缩放
          fontSize: "clamp(1.5rem, 5vw, 3rem)",
          lineHeight: 1.5, // 增加行高，防止换行后挤在一起
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default App;

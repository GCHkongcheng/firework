import { useState, useEffect } from "react";
import { Fireworks } from "@fireworks-js/react";

function App() {
  // 1. 简单的手机端检测 (用于减少粒子数量，提升性能)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // 2. 祝福语列表 (支持 Emoji 和换行)
  const messages = [
    "✨ Make a Wish! ✨",
    "新年快乐\nHappy New Year! 🎆", // \n 代表换行
    "身体健康，万事如意 ❤️",
    "前程似锦，未来可期 🌟",
    "保持热爱，奔赴山海 🌊",
  ];

  const [text, setText] = useState(messages[0]);
  const [isVisible, setIsVisible] = useState(true);

  // 3. 定时切换文字逻辑
  useEffect(() => {
    const changeCycle = () => {
      setIsVisible(false); // 先淡出
      setTimeout(() => {
        // 动画结束后切换文字
        const randomIndex = Math.floor(Math.random() * messages.length);
        setText(messages[randomIndex]);
        setIsVisible(true); // 再淡入
      }, 500); // 500ms 对应 CSS transition 时间
    };

    const interval = setInterval(changeCycle, 4000); // 4秒换一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh", // 适配手机浏览器地址栏
        // 背景：深夜空渐变
        background: "linear-gradient(to bottom, #020111 0%, #191b2e 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {/* 🏙️ 视觉增强层：城市剪影背景 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "30vh", // 城市占屏幕底部 30%
          // 使用一张通用的城市剪影图
          backgroundImage:
            'url("https://static.vecteezy.com/system/resources/previews/013/248/965/original/black-city-silhouette-free-png.png")',
          backgroundRepeat: "repeat-x",
          backgroundSize: "contain",
          backgroundPosition: "bottom center",
          zIndex: 2, // 放在烟花前面，产生“烟花在楼后爆炸”的纵深感
          pointerEvents: "none", // 让鼠标能点透它，触发后面的烟花
          opacity: 0.8,
        }}
      ></div>

      {/* 🎆 核心层：烟花组件 */}
      <Fireworks
        options={{
          hue: { min: 0, max: 360 },
          delay: { min: 30, max: 60 },
          rocketsPoint: { min: 50, max: 50 },
          opacity: 0.5,
          acceleration: 1.05,
          friction: 0.97,
          gravity: 1.5,
          // 手机端粒子减半，防止卡顿
          particles: isMobile ? 40 : 90,
          trace: isMobile ? 2 : 4,
          explosion: 6,
          intensity: 45,
          flickering: 50,
          lineStyle: "round",
          // 鼠标交互配置
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
            volume: { min: 10, max: 30 },
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
          background: "transparent", // 透明背景
          zIndex: 1, // 在城市后面
        }}
      />

      {/* 📝 文字层：霓虹特效 */}
      <div
        style={{
          position: "absolute",
          top: "35%", // 稍微靠上，避开底部城市
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
          textAlign: "center",
          pointerEvents: "none", // 必须点透
          zIndex: 10, // 最顶层

          // 动画与排版
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          whiteSpace: "pre-wrap", // 允许文字内的 \n 换行
          width: "90%",

          // 字体适配
          fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
          fontSize: "clamp(2rem, 8vw, 4.5rem)", // 智能缩放字体
          lineHeight: 1.3,

          // ✨ 赛博朋克霓虹光晕 (蓝色+紫色)
          textShadow: `
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 20px #00b3ff,
          0 0 40px #00b3ff,
          0 0 80px #e60073
        `,
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default App;

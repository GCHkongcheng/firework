import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Fireworks } from "@fireworks-js/react";

// 星空背景组件 - 优化版
const StarryBackground = memo(function StarryBackground({ starCount = 200 }) {
  // 使用 useMemo 缓存星星数据，避免重复计算
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.6 + 0.3,
    }));
  }, [starCount]);

  // 预定义样式对象，减少内存分配
  const containerStyle = useMemo(
    () => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none",
    }),
    [],
  );

  return (
    <div style={containerStyle}>
      {stars.map((star) => {
        // 使用 transform 代替 boxShadow，提升 GPU 性能
        const starStyle = {
          position: "absolute",
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          opacity: star.opacity,
          animation: `gentleTwinkle ${star.duration}s infinite ${star.delay}s ease-in-out`,
          // 只保留轻微的光晕效果
          filter: `blur(0.5px)`,
          willChange: "opacity, transform", // 提示浏览器优化
        };

        return <div key={star.id} style={starStyle} />;
      })}
      <style>
        {`
          @keyframes gentleTwinkle {
            0%, 100% { 
              opacity: 0.4;
              transform: scale(1);
            }
            33% { 
              opacity: 0.6;
              transform: scale(1.02);
            }
            66% { 
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </div>
  );
});

// 光粒子效果组件 - 优化版
const FloatingParticles = memo(function FloatingParticles({
  particleCount = 50,
}) {
  // 预计算颜色面板，避免重复计算
  const colorPalette = useMemo(
    () => [
      "rgba(0, 150, 255, 0.4)",
      "rgba(255, 100, 200, 0.4)",
      "rgba(100, 255, 150, 0.4)",
      "rgba(255, 200, 0, 0.4)",
      "rgba(150, 100, 255, 0.4)",
    ],
    [],
  );

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * 8,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
    }));
  }, [particleCount, colorPalette]);

  const containerStyle = useMemo(
    () => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1.5,
      pointerEvents: "none",
    }),
    [],
  );

  return (
    <div style={containerStyle}>
      {particles.map((particle) => {
        const particleStyle = {
          position: "absolute",
          left: `${particle.left}%`,
          top: `${particle.top}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          backgroundColor: particle.color,
          borderRadius: "50%",
          animation: `smoothFloat ${particle.duration}s infinite ${particle.delay}s ease-in-out`,
          // 使用 filter 代替 boxShadow
          filter: `blur(0.8px) brightness(1.2)`,
          willChange: "opacity, transform",
        };

        return <div key={particle.id} style={particleStyle} />;
      })}
      <style>
        {`
          @keyframes smoothFloat {
            0%, 100% {
              transform: translateY(0px) translateX(0px) scale(1);
              opacity: 0.3;
            }
            25% {
              transform: translateY(-6px) translateX(3px) scale(1.02);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-10px) translateX(-5px) scale(0.98);
              opacity: 0.5;
            }
            75% {
              transform: translateY(-8px) translateX(7px) scale(1.01);
              opacity: 0.4;
            }
          }
        `}
      </style>
    </div>
  );
});

function App() {
  // 1. 设备检测和性能适配
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: typeof window !== "undefined" && window.innerWidth < 768,
    isLowPower: false,
    devicePixelRatio:
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
    isLandscape:
      typeof window !== "undefined" && window.innerWidth > window.innerHeight,
  });

  // 2. 用户交互状态
  const [userSettings, setUserSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
    highPerformance: true,
    autoFullscreen: true,
  });

  // 3. 实时性能监控
  const [performanceState, setPerformanceState] = useState({
    fps: 60,
    lastFrameTime: performance.now(),
    frameCount: 0,
  });

  // 4. 触摸交互状态
  const [touchState, setTouchState] = useState({
    lastTap: 0,
    tapCount: 0,
    longPressTimer: null,
    isLongPress: false,
    touchStartTime: 0,
  });

  // 电池状态监控 - 优化版
  useEffect(() => {
    let batteryUpdateTimer;

    if ("getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBatteryInfo = () => {
          setDeviceInfo((prev) => ({
            ...prev,
            isLowPower: battery.level < 0.2 && !battery.charging,
          }));
        };

        // 使用防抖逻辑，减少频繁更新
        const debouncedUpdate = () => {
          clearTimeout(batteryUpdateTimer);
          batteryUpdateTimer = setTimeout(updateBatteryInfo, 1000);
        };

        battery.addEventListener("levelchange", debouncedUpdate);
        battery.addEventListener("chargingchange", debouncedUpdate);
        updateBatteryInfo();

        return () => {
          battery.removeEventListener("levelchange", debouncedUpdate);
          battery.removeEventListener("chargingchange", debouncedUpdate);
          clearTimeout(batteryUpdateTimer);
        };
      });
    }

    return () => {
      if (batteryUpdateTimer) {
        clearTimeout(batteryUpdateTimer);
      }
    };
  }, []);

  // 屏幕方向监听 - 优化版
  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      // 防抖处理，避免频繁更新
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setDeviceInfo((prev) => {
          const newIsMobile = window.innerWidth < 768;
          const newIsLandscape = window.innerWidth > window.innerHeight;

          // 只在值发生变化时才更新
          if (
            prev.isMobile !== newIsMobile ||
            prev.isLandscape !== newIsLandscape
          ) {
            return {
              ...prev,
              isMobile: newIsMobile,
              isLandscape: newIsLandscape,
            };
          }
          return prev;
        });

        // 自动全屏模式
        if (
          userSettings.autoFullscreen &&
          deviceInfo.isMobile &&
          !document.fullscreenElement
        ) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }
      }, 200); // 200ms 防抖
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [userSettings.autoFullscreen, deviceInfo.isMobile]);

  // 性能监控和自动调节 - 高度优化版
  useEffect(() => {
    let animationId;
    let frameBuffer = [];
    const BUFFER_SIZE = 60; // 缓冲区大小

    const monitorPerformance = (timestamp) => {
      const delta = timestamp - performanceState.lastFrameTime;
      const fps = 1000 / delta;

      // 使用滚动平均，减少 FPS 波动
      frameBuffer.push(fps);
      if (frameBuffer.length > BUFFER_SIZE) {
        frameBuffer.shift();
      }

      const avgFps =
        frameBuffer.reduce((sum, f) => sum + f, 0) / frameBuffer.length;

      setPerformanceState((prev) => {
        const newFrameCount = prev.frameCount + 1;

        // 只在 FPS 变化较大时才调整设置
        if (newFrameCount % 120 === 0) {
          // 扩大到 120 帧检查一次
          if (avgFps < 25 && prev.fps >= 35) {
            setUserSettings((prevSettings) => ({
              ...prevSettings,
              highPerformance: false,
            }));
          } else if (avgFps > 50 && prev.fps < 45) {
            setUserSettings((prevSettings) => ({
              ...prevSettings,
              highPerformance: true,
            }));
          }
        }

        // 只在 FPS 变化超过 5 时才更新
        if (Math.abs(avgFps - prev.fps) > 5) {
          return {
            fps: avgFps,
            lastFrameTime: timestamp,
            frameCount: newFrameCount,
          };
        }

        return {
          ...prev,
          lastFrameTime: timestamp,
          frameCount: newFrameCount,
        };
      });

      animationId = requestAnimationFrame(monitorPerformance);
    };

    animationId = requestAnimationFrame(monitorPerformance);
    return () => {
      cancelAnimationFrame(animationId);
      frameBuffer = [];
    };
  }, []);

  // 触觉反馈函数 - 优化版
  const triggerHapticFeedback = useCallback(
    (type = "impact") => {
      if (!userSettings.vibrationEnabled || !deviceInfo.isMobile) return;

      if ("vibrate" in navigator) {
        const patterns = {
          impact: [10],
          explosion: [50, 20, 100],
          success: [20, 50, 20],
        };
        navigator.vibrate(patterns[type] || patterns.impact);
      }
    },
    [userSettings.vibrationEnabled, deviceInfo.isMobile],
  );

  // 超级烟花效果（长按触发）
  const triggerSuperFireworks = useCallback((e) => {
    console.log("Super fireworks triggered!");
  }, []);

  // 双击烟花效果
  const triggerDoubleFireworks = useCallback(
    (e) => {
      triggerHapticFeedback("explosion");
      console.log("Double fireworks triggered!");
    },
    [triggerHapticFeedback],
  );

  // 高级触摸处理 - 优化版
  const handleTouchStart = useCallback(
    (e) => {
      const now = Date.now();
      setTouchState((prev) => {
        const timeSinceLastTap = now - prev.lastTap;

        // 清理之前的定时器
        if (prev.longPressTimer) {
          clearTimeout(prev.longPressTimer);
        }

        // 长按检测
        const longPressTimer = setTimeout(() => {
          setTouchState((current) => ({ ...current, isLongPress: true }));
          triggerHapticFeedback("success");
          triggerSuperFireworks(e);
        }, 500);

        return {
          ...prev,
          lastTap: now,
          tapCount: timeSinceLastTap < 300 ? prev.tapCount + 1 : 1,
          longPressTimer,
          isLongPress: false,
          touchStartTime: now,
        };
      });
    },
    [triggerHapticFeedback, triggerSuperFireworks],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      setTouchState((prev) => {
        if (prev.longPressTimer) {
          clearTimeout(prev.longPressTimer);
        }

        const touchDuration = Date.now() - prev.touchStartTime;

        // 如果不是长按，处理点击事件
        if (!prev.isLongPress && touchDuration < 500) {
          triggerHapticFeedback("impact");

          // 双击检测
          if (prev.tapCount === 2) {
            triggerDoubleFireworks(e);
            return { ...prev, tapCount: 0, longPressTimer: null };
          }
        }

        return {
          ...prev,
          longPressTimer: null,
          isLongPress: false,
        };
      });
    },
    [triggerHapticFeedback, triggerDoubleFireworks],
  );

  // 动态性能配置 - 高度优化版
  const getFireworksConfig = useMemo(() => {
    const baseConfig = {
      hue: { min: 0, max: 360 },
      delay: { min: 30, max: 60 },
      rocketsPoint: { min: 50, max: 50 },
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      explosion: 6,
      intensity: 45,
      flickering: 50,
      lineStyle: "round",
      mouse: {
        click: true,
        max: deviceInfo.isMobile ? 3 : 5,
      },
      sound: {
        enabled: userSettings.soundEnabled,
        files: [
          "https://fireworks.js.org/sounds/explosion0.mp3",
          "https://fireworks.js.org/sounds/explosion1.mp3",
          "https://fireworks.js.org/sounds/explosion2.mp3",
        ],
        volume: { min: 5, max: userSettings.soundEnabled ? 25 : 0 },
      },
    };

    // 根据设备性能和设置动态调整
    if (
      deviceInfo.isLowPower ||
      !userSettings.highPerformance ||
      performanceState.fps < 30
    ) {
      return {
        ...baseConfig,
        particles: deviceInfo.isMobile ? 15 : 30, // 进一步减少
        trace: deviceInfo.isMobile ? 1 : 2,
        intensity: 20,
        explosion: 3,
        flickering: 30, // 减少闪烁
      };
    } else {
      return {
        ...baseConfig,
        particles: deviceInfo.isMobile ? 50 : 100, // 适当减少
        trace: deviceInfo.isMobile ? 2 : 4,
        intensity: deviceInfo.isLandscape ? 55 : 40,
        explosion: 6,
      };
    }
  }, [
    deviceInfo.isLowPower,
    deviceInfo.isMobile,
    deviceInfo.isLandscape,
    userSettings.highPerformance,
    userSettings.soundEnabled,
    performanceState.fps,
  ]);

  // 祝福语列表
  const messages = [
    "✨ Make a Wish! ✨",
    "新年快乐\nHappy New Year! 🎆", // \n 代表换行
    "身体健康，万事如意 ❤️",
    "前程似锦，未来可期 🌟",
    "保持热爱，奔赴山海 🌊",
  ];

  const [text, setText] = useState(messages[0]);
  const [isVisible, setIsVisible] = useState(true);

  // 文字切换逻辑
  useEffect(() => {
    const changeCycle = () => {
      setIsVisible(false);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setText(messages[randomIndex]);
        setIsVisible(true);
      }, 500);
    };

    const interval = setInterval(changeCycle, 4000);
    return () => clearInterval(interval);
  }, []);

  // 缓存样式对象，避免重复创建
  const containerStyle = useMemo(
    () => ({
      width: "100vw",
      height: "100dvh",
      background: "#000000",
      position: "fixed",
      top: 0,
      left: 0,
      overflow: "hidden",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
      touchAction: "manipulation",
      willChange: "transform", // 提示 GPU 加速
    }),
    [],
  );

  const controlPanelStyle = useMemo(
    () => ({
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }),
    [],
  );

  const cityStyle = useMemo(
    () => ({
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "30vh",
      backgroundImage:
        'url("https://static.vecteezy.com/system/resources/previews/013/248/965/original/black-city-silhouette-free-png.png")',
      backgroundRepeat: "repeat-x",
      backgroundSize: "contain",
      backgroundPosition: "bottom center",
      zIndex: 2,
      pointerEvents: "none",
      opacity: 0.8,
      willChange: "opacity",
    }),
    [],
  );

  const textStyle = useMemo(
    () => ({
      position: "absolute",
      top: "35%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#fff",
      textAlign: "center",
      pointerEvents: "none",
      zIndex: 10,
      opacity: isVisible ? 1 : 0,
      transition: "opacity 0.5s ease-in-out",
      whiteSpace: "pre-wrap",
      width: "90%",
      fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
      fontSize: "clamp(2rem, 8vw, 4.5rem)",
      lineHeight: 1.3,
      textShadow: `
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 20px #00b3ff,
      0 0 40px #00b3ff,
      0 0 80px #e60073
    `,
      willChange: "opacity",
    }),
    [isVisible],
  );

  // 缓存按钮样式生成器
  const getButtonStyle = useCallback(
    (isActive, color) => ({
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.3)",
      background: isActive ? color : "rgba(255,255,255,0.1)",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      willChange: "background-color",
    }),
    [],
  );

  const getFpsIndicatorStyle = useCallback((fps) => {
    let bgColor;
    if (fps > 45) bgColor = "rgba(100,255,100,0.8)";
    else if (fps > 25) bgColor = "rgba(255,200,0,0.8)";
    else bgColor = "rgba(255,100,100,0.8)";

    return {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.3)",
      background: bgColor,
      color: "white",
      fontSize: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      willChange: "background-color",
    };
  }, []);

  return (
    <div
      style={containerStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ⭐ 星空背景层 */}
      <StarryBackground
        starCount={
          deviceInfo.isMobile
            ? userSettings.highPerformance
              ? 100
              : 50
            : userSettings.highPerformance
              ? 200
              : 100
        }
      />

      {/* ✨ 光粒子效果层 */}
      <FloatingParticles
        particleCount={
          deviceInfo.isMobile
            ? userSettings.highPerformance
              ? 25
              : 15
            : userSettings.highPerformance
              ? 50
              : 30
        }
      />

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
        options={getFireworksConfig}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
          background: "transparent",
          zIndex: 1,
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

import { motion, useReducedMotion } from "framer-motion";

/**
 * AuroraBackground
 *
 * A subtle premium background layer with animated radial gradients,
 * blurred blobs, and faint stars. Designed for dashboard content areas.
 *
 * Features:
 *   - Animated indigo/violet/cyan gradient blobs
 *   - Subtle star field (15-20 stars)
 *   - Slow, gentle animations
 *   - Light and dark theme support
 *   - Respects prefers-reduced-motion
 *   - Does not interfere with layout or content
 *
 * Props:
 *   children    : React.ReactNode — content to render above the aurora
 *   className   : string — additional classes for the wrapper
 *   showStars   : boolean — whether to show stars (default: true)
 *
 * Usage:
 *   <AuroraBackground>
 *     <div>Your content here</div>
 *   </AuroraBackground>
 */
const AuroraBackground = ({ children, className = "", showStars = true }) => {
  const shouldReduceMotion = useReducedMotion();

  // Generate subtle random stars (15-20 stars)
  const stars = showStars
    ? Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5, // 0.5-2px
        opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5
        delay: Math.random() * 5,
      }))
    : [];

  // Animation config — disabled if prefers-reduced-motion
  const getBlobAnimation = (config) => {
    if (shouldReduceMotion) {
      return {
        opacity: config.opacity[1], // Use middle opacity value
        x: 0,
        y: 0,
      };
    }
    return {
      opacity: config.opacity,
      x: config.x,
      y: config.y,
    };
  };

  const getAnimationTransition = (duration, delay = 0) => {
    if (shouldReduceMotion) {
      return { duration: 0 };
    }
    return {
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Aurora gradient blobs layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blob 1 — indigo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={getBlobAnimation({
            opacity: [0.3, 0.5, 0.3],
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          })}
          transition={getAnimationTransition(25)}
          className="absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[100px] dark:bg-indigo-400/30"
          style={{ willChange: shouldReduceMotion ? "auto" : "transform, opacity" }}
        />

        {/* Blob 2 — violet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={getBlobAnimation({
            opacity: [0.25, 0.45, 0.25],
            x: [100, -80, 100],
            y: [60, -40, 60],
          })}
          transition={getAnimationTransition(30, 2)}
          className="absolute right-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[120px] dark:bg-violet-400/25"
          style={{ willChange: shouldReduceMotion ? "auto" : "transform, opacity" }}
        />

        {/* Blob 3 — cyan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={getBlobAnimation({
            opacity: [0.2, 0.4, 0.2],
            x: [-80, 120, -80],
            y: [80, -60, 80],
          })}
          transition={getAnimationTransition(28, 5)}
          className="absolute bottom-[10%] left-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[110px] dark:bg-cyan-400/20"
          style={{ willChange: shouldReduceMotion ? "auto" : "transform, opacity" }}
        />

        {/* Blob 4 — blue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={getBlobAnimation({
            opacity: [0.2, 0.35, 0.2],
            x: [60, -100, 60],
            y: [-70, 90, -70],
          })}
          transition={getAnimationTransition(32, 8)}
          className="absolute bottom-[20%] right-[10%] h-[380px] w-[380px] rounded-full bg-blue-500/15 blur-[100px] dark:bg-blue-400/25"
          style={{ willChange: shouldReduceMotion ? "auto" : "transform, opacity" }}
        />

        {/* Stars layer */}
        {showStars && (
          <div className="absolute inset-0">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: star.opacity }
                    : {
                        opacity: [star.opacity, star.opacity * 0.5, star.opacity],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: star.delay,
                      }
                }
                className="absolute rounded-full bg-slate-300/40 dark:bg-slate-400/30"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content layer — sits above aurora */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuroraBackground;

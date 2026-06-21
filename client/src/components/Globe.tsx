import earth from "../assets/earth.png";

export default function Globe() {
  return (
    <div className="relative flex items-center justify-center">

      {/* Glow */}

      <div
        className="
          absolute
          w-[700px]
          h-[700px]
          rounded-full
          bg-cyan-500/20
          blur-[120px]
        "
      />

      {/* Earth */}
      <img
        src={earth}
        alt="Earth"
        className="
          w-[550px]
          h-[550px]
          object-contain
          animate-earth
          relative
          z-10
        "
      />
    </div>
  );
}

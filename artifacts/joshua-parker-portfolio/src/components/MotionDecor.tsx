type MotionDecorProps = {
  theme: 'abstract' | 'interests' | 'writing';
};

export function MotionDecor({ theme }: MotionDecorProps) {
  return (
    <div className={`motion-decor motion-decor-${theme}`} aria-hidden="true">
      {theme === 'interests' ? (
        <>
          <svg className="decor-lacrosse" viewBox="0 0 120 120" fill="none">
            <path d="M31 92 75 31M70 28c14-8 26-6 32 2l-9 22c-10 5-20 3-28-3Z" />
            <path d="m75 31 18 18M72 36l18 17M68 42l18 16M64 48l18 15" />
          </svg>
          <svg className="decor-swords" viewBox="0 0 120 120" fill="none">
            <path d="m27 91 65-65M92 26l7 7M23 87l9 9M93 29 30 92M27 25l66 66M24 29l7-7M90 94l7-7" />
            <path d="m45 76 8 8m-5-15 8 8M73 46l8 8m-5-15 8 8" />
          </svg>
        </>
      ) : theme === 'writing' ? (
        <>
          <svg className="decor-paper" viewBox="0 0 160 140" fill="none">
            <path d="M35 20h72l20 20v82H35zM107 20v22h20M52 61h56M52 76h56M52 91h42" />
          </svg>
          <svg className="decor-pen" viewBox="0 0 120 120" fill="none">
            <path d="m30 88 10-28 45-45 18 18-45 45-28 10Z" />
            <path d="m40 60 18 18m27-63 18 18M30 88l15-5" />
          </svg>
        </>
      ) : (
        <>
          <span className="abstract-smoke abstract-smoke-one" />
          <span className="abstract-smoke abstract-smoke-two" />
          <span className="abstract-smoke abstract-smoke-three" />
        </>
      )}
    </div>
  );
}

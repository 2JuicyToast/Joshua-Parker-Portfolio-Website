import { publicAsset } from '../lib/public-asset';

type MotionDecorProps = {
  theme: 'abstract' | 'interests' | 'writing';
};

export function MotionDecor({ theme }: MotionDecorProps) {
  return (
    <div className={`motion-decor motion-decor-${theme}`} aria-hidden="true">
      {theme === 'interests' ? (
        <>
          <img className="decor-lacrosse" src={publicAsset('lacrosse-stick-doodle.png')} alt="" draggable={false} />
          <img className="decor-swords" src={publicAsset('hema-sword-doodle.png')} alt="" draggable={false} />
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

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
        <img
          className="decor-quill-book"
          src={publicAsset('writing-quill-book.jpg')}
          alt=""
          draggable={false}
        />
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

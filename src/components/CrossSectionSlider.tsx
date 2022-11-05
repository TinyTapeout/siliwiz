import { setViewerState, viewerState } from '~/model/viewerState';

export default function CrossSectionSlider() {
  const height = 400;
  const sliderTranslate = () => `-${height / 2 - 15}px, ${height / 2 - 10}px`;
  return (
    <span style={{ width: '30px' }}>
      <input
        type="range"
        min={0}
        max={height}
        style={{
          transform: `translate(${sliderTranslate()}) rotate(90deg)`,
          width: height + 'px',
        }}
        value={viewerState.crossSectionOffset}
        onInput={(e) =>
          setViewerState('crossSectionOffset', (e.target as HTMLInputElement).valueAsNumber)
        }
      />
    </span>
  );
}

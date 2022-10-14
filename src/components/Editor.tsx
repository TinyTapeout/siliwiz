import Canvas from './Canvas';
import CrossSection from './CrossSection';

export default function Editor() {
  return (
    <div style={{ display: 'flex', 'margin-top': '16px' }}>
      <Canvas />
      <CrossSection />
    </div>
  );
}

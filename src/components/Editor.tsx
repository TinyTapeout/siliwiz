import Canvas from './Canvas';
import CrossSection from './CrossSection';

export default function Editor() {
  return (
    <div style={{ display: 'flex' }}>
      <Canvas />
      <CrossSection />
    </div>
  );
}

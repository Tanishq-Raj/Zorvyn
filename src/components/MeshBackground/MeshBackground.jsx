import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import './MeshBackground.css';

export default function MeshBackground() {
  const { darkMode } = useStore();

  return (
    <div className={`mesh-bg ${darkMode ? 'dark-mesh' : 'light-mesh'}`}>
      <motion.div 
        className="blob blob-1"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="blob blob-2"
        animate={{
          x: [0, -120, 60, 0],
          y: [0, 100, -40, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="blob blob-3"
        animate={{
          x: [0, 80, -90, 0],
          y: [0, -60, 110, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <div className="mesh-overlay"></div>
    </div>
  );
}

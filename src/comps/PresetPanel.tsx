import { CWComplex } from '../math/CWComplex';
import styles from './PresetPanel.module.css';


type PresetPanelProps = {
    setComplex: React.Dispatch<React.SetStateAction<CWComplex>>;
}

export default function PresetPanel({ setComplex }: PresetPanelProps) {
  return (
    <div className={styles.PresetPanel}>
      PresetPanel
      <div style={{display: "flex", flexDirection: "row"}}>
        {[0, 1, 2].map((dim) => (
          <button 
            key={dim}
          >
            {dim}D
          </button>
        ))}
      </div>
    </div>
  );
}
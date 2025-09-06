import React, { useEffect, useState } from 'react';
import MobileScene, { DragSelectData } from './mobile/MobileScene';
import { Preset, defaultComplex } from './data/presets';
import { useEditComplex } from './hooks/useCWComplexEditor';
import { CWComplex } from './math/CWComplex';
import { EditOptions, defaultEditOptions, ViewOptions, defaultViewOptions } from './options';

export default function MobileApp() {


    const [allowEditing, setAllowEditing] = useState(true);
    const [ editOptions, setEditOptions] = useState<EditOptions>(defaultEditOptions);
    const [ viewOptions, setViewOptions] = useState<ViewOptions>(defaultViewOptions);
  
    const [preset, setPreset] = useState<Preset>(() => defaultComplex);
    
    const [editorState, complexEditor] = useEditComplex();
    
    useEffect(() => {
      complexEditor.reset();
      preset(complexEditor);
      complexEditor.deselectAll();
    }, [preset]);
  
    
  return (
    <div style={{textAlign: 'center' }}>
      {complexEditor.currentComplex.size}
      <MobileScene 
        viewOptions={viewOptions} 
        editOptions={editOptions} 
        complex={complexEditor.currentComplex} 
        allowEditing={allowEditing} 
        stepIndex={complexEditor.editorState.history.length - 1} 
        editComplex={complexEditor} 
      />        
    </div>
  );
}
